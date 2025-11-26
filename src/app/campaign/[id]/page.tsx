import { notFound } from "next/navigation"
import { PixQRCode } from "@/components/molecules/PixQRCode"
import { SupportersList } from "@/components/molecules/SupportersList"
import { Progress } from "@/components/atoms/Progress"
import { Button } from "@/components/atoms/Button"
import { formatCurrency } from "@/lib/pix"
import { Share2, Flag, Calendar, User } from "lucide-react"

// Mock Data Lookup
async function getCampaign(id: string) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    const campaigns = [
        {
            id: "1",
            title: "Reconstrução da Casa da Dona Maria",
            description: "Ajude a Dona Maria a reconstruir sua casa que foi afetada pelas chuvas. Precisamos de material de construção e mão de obra. A casa foi severamente danificada e ela está morando de favor. Qualquer ajuda é bem-vinda!",
            imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000&auto=format&fit=crop",
            goal: 15000,
            raised: 8750,
            pixKey: "email@example.com",
            beneficiaryName: "Maria da Silva",
            createdAt: "2023-10-01",
            creatorId: "user1",
            supporters: [
                { id: "s1", name: "João Pedro", amount: 100, message: "Força Dona Maria!", date: "2023-10-02" },
                { id: "s2", name: "Ana Clara", amount: 50, message: "Deus abençoe", date: "2023-10-03" },
                { id: "s3", name: "Anônimo", amount: 200, date: "2023-10-04" },
            ]
        },
        // ... other mocks if needed, but fallback to generic for demo
    ]

    const campaign = campaigns.find((c) => c.id === id)

    if (!campaign && id) {
        // Return a generic mock for any other ID to keep the demo working
        return {
            id,
            title: "Campanha Exemplo " + id,
            description: "Esta é uma campanha de exemplo gerada dinamicamente para demonstração.",
            imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop",
            goal: 10000,
            raised: 2500,
            pixKey: "chave-pix-aleatoria",
            beneficiaryName: "Beneficiário Exemplo",
            createdAt: "2023-11-01",
            creatorId: "userX",
            supporters: []
        }
    }

    return campaign
}

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const campaign = await getCampaign(id)

    if (!campaign) {
        notFound()
    }

    const percentage = Math.round((campaign.raised / campaign.goal) * 100)

    return (
        <div className="container-custom py-8 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Media & Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-xl overflow-hidden bg-gray-100 aspect-video shadow-sm">
                        <img
                            src={campaign.imageUrl}
                            alt={campaign.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{campaign.title}</h1>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Criado em {new Date(campaign.createdAt).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>Por Organizador</span>
                            </div>
                        </div>

                        <div className="prose dark:prose-invert max-w-none">
                            <p className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                                {campaign.description}
                            </p>
                        </div>
                    </div>

                    <div className="pt-8 border-t">
                        <SupportersList supporters={campaign.supporters || []} />
                    </div>
                </div>

                {/* Right Column: Donation & Actions */}
                <div className="space-y-6">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-3xl font-bold text-primary">{formatCurrency(campaign.raised)}</span>
                                    <span className="text-muted-foreground">de {formatCurrency(campaign.goal)}</span>
                                </div>
                                <Progress value={campaign.raised} max={campaign.goal} className="h-3" />
                                <p className="text-sm text-muted-foreground text-right">{percentage}% da meta</p>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-semibold text-center">Doe agora com Pix</h3>
                                <PixQRCode
                                    pixKey={campaign.pixKey}
                                    beneficiaryName={campaign.beneficiaryName}
                                    amount={0} // Open amount
                                    description={`Doação para ${campaign.title}`}
                                />
                            </div>

                            <div className="pt-4 border-t flex justify-center">
                                <Button variant="ghost" className="text-muted-foreground hover:text-destructive gap-2" size="sm">
                                    <Flag className="h-4 w-4" />
                                    Denunciar campanha
                                </Button>
                            </div>
                        </div>

                        <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <Share2 className="h-4 w-4" />
                                Espalhe a solidariedade
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Compartilhar essa campanha aumenta em 3x as chances de bater a meta!
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="w-full">WhatsApp</Button>
                                <Button variant="outline" className="w-full">Facebook</Button>
                                <Button variant="outline" className="w-full">Twitter</Button>
                                <Button variant="outline" className="w-full">Copiar Link</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
