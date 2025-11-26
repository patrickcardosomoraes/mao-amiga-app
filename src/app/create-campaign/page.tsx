"use client"

import * as React from "react"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { Textarea } from "@/components/atoms/Textarea"
import { Label } from "@/components/atoms/Label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/atoms/Card"
import { Upload, DollarSign, Key, Image as ImageIcon } from "lucide-react"

export default function CreateCampaignPage() {
    const [isLoading, setIsLoading] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsLoading(false)
        alert("Campanha criada com sucesso! (Demo)")
        // Redirect would happen here
    }

    return (
        <div className="container-custom py-12 max-w-2xl">
            <div className="space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Crie sua Vaquinha</h1>
                    <p className="text-muted-foreground">
                        Preencha os dados abaixo para começar a receber doações via Pix. É grátis e rápido.
                    </p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>Detalhes da Campanha</CardTitle>
                            <CardDescription>Conte sua história e defina sua meta.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título da Campanha</Label>
                                <Input id="title" placeholder="Ex: Ajuda para cirurgia do Rex" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">História Completa</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Conte detalhadamente por que você precisa de ajuda..."
                                    className="min-h-[150px]"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="goal">Meta (R$)</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input id="goal" type="number" placeholder="0,00" className="pl-9" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="pixKey">Chave Pix (CPF, Email, Tel ou Aleatória)</Label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input id="pixKey" placeholder="Sua chave Pix" className="pl-9" required />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Imagem ou Vídeo de Capa</Label>
                                <div className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-secondary/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                    <div className="p-3 bg-secondary rounded-full">
                                        <Upload className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Clique para fazer upload</p>
                                        <p className="text-xs">JPG, PNG ou MP4 (max. 10MB)</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="ghost" type="button">Cancelar</Button>
                            <Button type="submit" isLoading={isLoading} className="w-full md:w-auto ml-auto">
                                Lançar Campanha
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
