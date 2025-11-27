"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { Textarea } from "@/components/atoms/Textarea"
import { Label } from "@/components/atoms/Label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/atoms/Card"
import { Upload, DollarSign, Key, X, User } from "lucide-react"
import { createClient } from "@/lib/supabase-client"

export default function CreateCampaignPage() {
    const router = useRouter()
    const supabase = createClient()
    const [isLoading, setIsLoading] = React.useState(false)
    const [file, setFile] = React.useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    // Form states
    const [title, setTitle] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [goal, setGoal] = React.useState("")
    const [pixKey, setPixKey] = React.useState("")
    const [beneficiaryName, setBeneficiaryName] = React.useState("")

    // Check auth on mount
    React.useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/login?redirect=/create-campaign")
            }
        }
        checkUser()
    }, [supabase, router])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            const objectUrl = URL.createObjectURL(selectedFile)
            setPreviewUrl(objectUrl)
        }
    }

    const handleRemoveImage = () => {
        setFile(null)
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
            setPreviewUrl(null)
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            console.log("Iniciando criação de campanha...")
            const { data: { user }, error: authError } = await supabase.auth.getUser()

            if (authError || !user) {
                console.error("Erro de autenticação:", authError)
                throw new Error("Usuário não autenticado. Por favor, faça login novamente.")
            }

            // Validação da Meta
            const numericGoal = parseFloat(goal.replace(/\./g, '').replace(',', '.'))
            if (isNaN(numericGoal) || numericGoal <= 0) {
                throw new Error("O valor da meta é inválido. Digite um número maior que zero.")
            }

            let imageUrl = null

            // 1. Upload Image if exists
            if (file) {
                console.log("Iniciando upload de imagem...")
                const fileExt = file.name.split('.').pop()
                const fileName = `${user.id}/${Date.now()}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('campaign-images')
                    .upload(fileName, file)

                if (uploadError) {
                    console.error("Erro no upload:", uploadError)
                    throw uploadError
                }

                const { data: publicUrlData } = supabase.storage
                    .from('campaign-images')
                    .getPublicUrl(fileName)

                imageUrl = publicUrlData.publicUrl
                console.log("Imagem enviada com sucesso:", imageUrl)
            }

            // 2. Create Campaign
            console.log("Inserindo campanha no banco...")
            const { data, error: insertError } = await supabase
                .from('campaigns')
                .insert([
                    {
                        creator_id: user.id,
                        title,
                        description,
                        goal: numericGoal,
                        pix_key: pixKey,
                        beneficiary_name: beneficiaryName,
                        image_url: imageUrl,
                        status: 'active'
                    }
                ])
                .select()
                .single()

            if (insertError) {
                console.error("Erro na inserção:", insertError)
                throw insertError
            }

            console.log("Campanha criada:", data)

            // 3. Redirect
            if (data) {
                router.push(`/campaign/${data.id}`)
            }

        } catch (error: any) {
            console.error("Erro detalhado no catch:", error)

            let errorMessage = "Erro desconhecido"

            if (error instanceof Error) {
                errorMessage = error.message
            } else if (typeof error === 'object' && error !== null) {
                // Tenta extrair mensagem de objetos de erro do Supabase/Postgres
                errorMessage = error.message || error.error_description || error.details || JSON.stringify(error)
            } else if (typeof error === 'string') {
                errorMessage = error
            }

            if (errorMessage.includes("bucket")) {
                alert(`Erro no upload da imagem: O bucket 'campaign-images' não foi encontrado ou você não tem permissão. Verifique se criou o bucket no Supabase. Detalhes: ${errorMessage}`)
            } else if (errorMessage.includes("row-level security") || errorMessage.includes("policy")) {
                alert(`Erro de permissão: Você não tem permissão para criar campanhas. Verifique se está logado corretamente. Detalhes: ${errorMessage}`)
            } else {
                alert(`Erro ao criar campanha: ${errorMessage}`)
            }
        } finally {
            setIsLoading(false)
        }
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
                                <Input
                                    id="title"
                                    placeholder="Ex: Ajuda para cirurgia do Rex"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="beneficiary">Nome do Beneficiário</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="beneficiary"
                                        placeholder="Quem receberá a ajuda?"
                                        className="pl-9"
                                        required
                                        value={beneficiaryName}
                                        onChange={(e) => setBeneficiaryName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">História Completa</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Conte detalhadamente por que você precisa de ajuda..."
                                    className="min-h-[150px]"
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="goal">Meta (R$)</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="goal"
                                            type="number"
                                            step="0.01"
                                            placeholder="0,00"
                                            className="pl-9"
                                            required
                                            value={goal}
                                            onChange={(e) => setGoal(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="pixKey">Chave Pix</Label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="pixKey"
                                            placeholder="CPF, Email, Tel ou Aleatória"
                                            className="pl-9"
                                            required
                                            value={pixKey}
                                            onChange={(e) => setPixKey(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Imagem de Capa</Label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />

                                {!previewUrl ? (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-secondary/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 text-muted-foreground"
                                    >
                                        <div className="p-3 bg-secondary rounded-full">
                                            <Upload className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Clique para fazer upload</p>
                                            <p className="text-xs">JPG ou PNG (max. 5MB)</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative rounded-xl overflow-hidden border aspect-video group">
                                        <Image
                                            src={previewUrl}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={handleRemoveImage}
                                                className="gap-2"
                                            >
                                                <X className="h-4 w-4" />
                                                Remover Imagem
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="ghost" type="button" onClick={() => router.back()}>Cancelar</Button>
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
