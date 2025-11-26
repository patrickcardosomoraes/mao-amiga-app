import { CampaignCard } from "@/components/organisms/CampaignCard"
import { Button } from "@/components/atoms/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import { PlusCircle, TrendingUp, Heart } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
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
                        <div className="text-2xl font-bold">R$ 12.350,00</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% em relação ao mês passado
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
                        <div className="text-2xl font-bold">R$ 450,00</div>
                        <p className="text-xs text-muted-foreground">
                            Você apoiou 3 causas este mês
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Minhas Campanhas Ativas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Mock Campaign */}
                    <CampaignCard campaign={{
                        id: "1",
                        title: "Reconstrução da Casa da Dona Maria",
                        description: "Ajude a Dona Maria a reconstruir sua casa...",
                        imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000&auto=format&fit=crop",
                        goal: 15000,
                        raised: 8750,
                        pixKey: "email@example.com",
                        beneficiaryName: "Maria da Silva",
                        createdAt: "2023-10-01",
                        creatorId: "user1",
                        status: 'active'
                    }} />
                </div>
            </div>
        </div>
    )
}
