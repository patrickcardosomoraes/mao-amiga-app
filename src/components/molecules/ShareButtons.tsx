"use client"

import { Button } from "@/components/atoms/Button"
import { Share2, Link as LinkIcon, Check } from "lucide-react"
import { useState } from "react"

interface ShareButtonsProps {
    campaignId: string
    campaignTitle: string
}

export function ShareButtons({ campaignId, campaignTitle }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false)

    // URL base da aplicação (ajuste conforme seu domínio em produção)
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const campaignUrl = `${baseUrl}/campaign/${campaignId}`
    const encodedUrl = encodeURIComponent(campaignUrl)
    const encodedTitle = encodeURIComponent(`Ajude na campanha: ${campaignTitle}`)

    const handleShareWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, '_blank')
    }

    const handleShareFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')
    }

    const handleShareTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, '_blank')
    }

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(campaignUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Falha ao copiar link", err)
        }
    }

    return (
        <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Espalhe a solidariedade
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
                Compartilhar essa campanha aumenta em 3x as chances de bater a meta!
            </p>
            <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="w-full" onClick={handleShareWhatsApp}>
                    WhatsApp
                </Button>
                <Button variant="outline" className="w-full" onClick={handleShareFacebook}>
                    Facebook
                </Button>
                <Button variant="outline" className="w-full" onClick={handleShareTwitter}>
                    Twitter
                </Button>
                <Button variant="outline" className="w-full gap-2" onClick={handleCopyLink}>
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <LinkIcon className="h-4 w-4" />}
                    {copied ? "Copiado!" : "Copiar Link"}
                </Button>
            </div>
        </div>
    )
}
