"use client"

import * as React from "react"
import { QRCodeCanvas } from "qrcode.react"
import { Button } from "@/components/atoms/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/atoms/Card"
import { Copy, Share2, Check } from "lucide-react"
import { generatePixPayload } from "@/lib/pix"
import { cn } from "@/lib/utils"

interface PixQRCodeProps {
    pixKey: string
    beneficiaryName: string
    city?: string
    amount?: number
    description?: string
    className?: string
}

export function PixQRCode({
    pixKey,
    beneficiaryName,
    city = "Brasil",
    amount,
    description,
    className,
}: PixQRCodeProps) {
    const [copied, setCopied] = React.useState(false)

    // In a real app, use a proper library to generate the full EMVCo string
    const pixPayload = generatePixPayload({ key: pixKey, name: beneficiaryName, city, amount, description })

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(pixPayload)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy", err)
        }
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Apoie ${beneficiaryName}`,
                    text: `Contribua com a campanha de ${beneficiaryName} via Pix!`,
                    url: window.location.href,
                })
            } catch (err) {
                console.error("Error sharing", err)
            }
        } else {
            // Fallback or toast
            alert("Compartilhamento não suportado neste navegador")
        }
    }

    return (
        <Card className={cn("w-full max-w-sm mx-auto overflow-hidden", className)}>
            <CardHeader className="text-center pb-2">
                <CardTitle>Contribua via Pix</CardTitle>
                <CardDescription>Escaneie o QR Code ou copie a chave</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6 pt-4">
                <div className="p-4 bg-white rounded-xl shadow-inner border border-gray-100">
                    <QRCodeCanvas
                        value={pixPayload}
                        size={200}
                        level={"H"}
                        includeMargin={true}
                    />
                </div>

                <div className="w-full space-y-2">
                    <div className="flex gap-2">
                        <Button
                            className="flex-1"
                            variant={copied ? "default" : "outline"}
                            onClick={handleCopy}
                        >
                            {copied ? (
                                <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Copiado!
                                </>
                            ) : (
                                <>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copiar Código Pix
                                </>
                            )}
                        </Button>
                        <Button variant="secondary" size="icon" onClick={handleShare}>
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-center text-muted-foreground break-all px-4">
                        Chave: {pixKey}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
