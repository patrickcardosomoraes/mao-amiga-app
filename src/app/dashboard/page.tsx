import { CampaignCard } from "@/components/organisms/CampaignCard"
import { Button } from "@/components/atoms/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import { PlusCircle, TrendingUp, Heart } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { formatCurrency } from "@/lib/pix"

export default async function DashboardPage() {
    const supabase = await createClient()

    // 1. Check Auth
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // 2. Fetch User's Campaigns
    const { data: campaigns } = await supabase
        .from('campaigns')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })

    // 3. Calculate Stats
    const totalRaised = campaigns?.reduce((acc, curr) => acc + Number(curr.raised), 0) || 0
    const activeCampaignsCount = campaigns?.filter(c => c.status === 'active').length || 0

    // Transform for UI
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const myCampaigns = campaigns?.map((c: any) => ({
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
        status: c.status
    })) || []

    return (
        <div className="container-custom py-12 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Meu Painel</h1>
                <Link href="/create-campaign">
                    <Button className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Nova Campanha
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Arrecadado
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalRaised)}</div>
                        <p className="text-xs text-muted-foreground">
                            Em {activeCampaignsCount} campanhas ativas
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Doações Realizadas
                        </CardTitle>
                        <Heart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ 0,00</div>
                        <p className="text-xs text-muted-foreground">
                            Histórico de doações em breve
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Minhas Campanhas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myCampaigns.length > 0 ? (
                        myCampaigns.map((campaign) => (
                            <CampaignCard key={campaign.id} campaign={campaign} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 border rounded-xl bg-gray-50 dark:bg-gray-900/50">
                            <p className="text-muted-foreground mb-4">Você ainda não criou nenhuma campanha.</p>
                            <Link href="/create-campaign">
                                <Button variant="outline">Criar minha primeira campanha</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
