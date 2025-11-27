"use client"

import * as React from "react"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { Textarea } from "@/components/atoms/Textarea"
import { Label } from "@/components/atoms/Label"
import { createClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"
import { CheckCircle2, X } from "lucide-react"

interface RegisterDonationProps {
    campaignId: string
}

export function RegisterDonation({ campaignId }: RegisterDonationProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const router = useRouter()
    const supabase = createClient()

    // Form states
    const [amount, setAmount] = React.useState("")
    const [name, setName] = React.useState("")
    const [message, setMessage] = React.useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const numericAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'))

            if (isNaN(numericAmount) || numericAmount <= 0) {
                alert("Por favor, insira um valor válido.")
                setIsLoading(false)
                return
            }

            const { error } = await supabase
                .from('supporters')
                .insert([
                    {
                        campaign_id: campaignId,
                        name: name || "Doador Anônimo",
                        amount: numericAmount,
                        message: message
                    }
                ])

            if (error) throw error

            alert("Doação registrada com sucesso! Obrigado pelo apoio.")
            setIsOpen(false)
            setAmount("")
            setName("")
            setMessage("")
            router.refresh() // Atualiza a página para mostrar o novo valor e o apoiador na lista

        } catch (error: any) {
            console.error("Erro detalhado ao registrar doação:", error)
            const errorMessage = error.message || error.error_description || "Erro desconhecido ao processar doação."
            alert(`Erro ao registrar doação: ${errorMessage}`)
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/5"
            >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Já fiz o Pix / Registrar Doação
            </Button>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md bg-background rounded-xl shadow-2xl border p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Registrar Doação</h3>
                    <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Valor da Doação (R$)</Label>
                        <Input
                            id="amount"
                            placeholder="0,00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="text-lg font-semibold"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Seu Nome (Opcional)</Label>
                        <Input
                            id="name"
                            placeholder="Deixe em branco para Anônimo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Mensagem de Apoio (Opcional)</Label>
                        <Textarea
                            id="message"
                            placeholder="Escreva uma mensagem para a campanha..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-1" disabled={isLoading}>
                            {isLoading ? "Registrando..." : "Confirmar Doação"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
