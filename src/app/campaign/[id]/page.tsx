import { notFound } from "next/navigation"
import Image from "next/image"
import { PixQRCode } from "@/components/molecules/PixQRCode"
import { SupportersList } from "@/components/molecules/SupportersList"
import { Progress } from "@/components/atoms/Progress"
import { Button } from "@/components/atoms/Button"
import { formatCurrency } from "@/lib/pix"
import { Share2, Flag, Calendar, User } from "lucide-react"

import { createClient } from "@/lib/supabase-server"

// Fetch Real Data from Supabase
async function getCampaign(id: string) {
    const supabase = await createClient()

    // 1. Fetch Campaign Details
    const { data: campaign, error } = await supabase
        .from('campaigns')
        .select(`
            *,
            profiles:creator_id (
                name,
                avatar_url
            )
        `)
        .eq('id', id)
        .single()

    if (error || !campaign) {
        console.error("Erro ao buscar campanha:", error)
        return null
    }

    // 2. Fetch Supporters (Last 5)
    const { data: supporters } = await supabase
        .from('supporters')
        .select('*')
        .eq('campaign_id', id)
        .order('created_at', { ascending: false })
        .limit(5)

    // 3. Transform Data to match UI component expectations
    return {
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        imageUrl: campaign.image_url || "/placeholder-campaign.jpg", // Fallback image
        goal: Number(campaign.goal),
        raised: Number(campaign.raised),
        pixKey: campaign.pix_key,
        beneficiaryName: campaign.beneficiary_name,
        createdAt: campaign.created_at,
        creatorId: campaign.creator_id,
        creatorName: campaign.profiles?.name || "Organizador",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        supporters: supporters?.map((s: any) => ({
            id: s.id,
            name: s.name,
            amount: Number(s.amount),
            message: s.message,
            date: s.created_at
        })) || []
    }
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
                    <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video shadow-sm">
                        <Image
                            src={campaign.imageUrl}
                            alt={campaign.title}
                            fill
                            className="object-cover"
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
