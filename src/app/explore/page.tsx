import { CampaignCard } from "@/components/organisms/CampaignCard"
import { SearchInput } from "@/components/molecules/SearchInput"
import { createClient } from "@/lib/supabase-server"

export const revalidate = 0 // Desabilitar cache estático para busca funcionar em tempo real (ou usar force-dynamic)

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams
    const supabase = await createClient()

    let query = supabase
        .from('campaigns')
        .select(`
            *,
            profiles:creator_id (
                name,
                avatar_url
            )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

    if (q) {
        // Filtra por título OU descrição que contenha o termo (ilike = case insensitive)
        query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    }

    const { data: campaigns } = await query

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const realCampaigns = campaigns?.map((c: any) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        imageUrl: c.image_url || "/placeholder-campaign.jpg",
        goal: Number(c.goal),
        raised: Number(c.raised),
        pixKey: c.pix_key,
        beneficiaryName: c.beneficiary_name,
        createdAt: c.created_at,
        creatorId: c.creator_id,
        creatorName: c.profiles?.name || "Organizador",
        status: c.status
    })) || []

    return (
        <div className="container-custom py-12 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Explorar Campanhas</h1>
                <div className="flex w-full md:w-auto gap-2">
                    <SearchInput />
                </div>
            </div>

            <p className="text-muted-foreground">
                Exibindo resultados para: <span className="font-semibold text-primary">&quot;{q}&quot;</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {realCampaigns.length > 0 ? (
                    realCampaigns.map((campaign) => (
                        <CampaignCard key={campaign.id} campaign={campaign} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground bg-secondary/20 rounded-xl border border-dashed">
                        <p className="text-lg">Nenhuma campanha encontrada.</p>
                        {q && <p className="text-sm mt-2">Tente buscar por outros termos.</p>}
                    </div>
                )}
            </div>
        </div>
    )
}
