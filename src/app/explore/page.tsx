import { CampaignCard } from "@/components/organisms/CampaignCard"
import { Input } from "@/components/atoms/Input"
import { Button } from "@/components/atoms/Button"
import { Search } from "lucide-react"
import { createClient } from "@/lib/supabase-server"

export const revalidate = 60 // Revalidar a cada 60 segundos

export default async function ExplorePage() {
    const supabase = await createClient()

    const { data: campaigns } = await supabase
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
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar causas..." className="pl-9" />
                    </div>
                    <Button>Buscar</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {realCampaigns.length > 0 ? (
                    realCampaigns.map((campaign) => (
                        <CampaignCard key={campaign.id} campaign={campaign} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        Nenhuma campanha encontrada.
                    </div>
                )}
            </div>
        </div>
    )
}
