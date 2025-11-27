"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { Textarea } from "@/components/atoms/Textarea"
import { Label } from "@/components/atoms/Label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/atoms/Card"
import { Upload, DollarSign, Key, X, User, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase-client"

export default function EditCampaignPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string
    const supabase = createClient()

    const [isLoading, setIsLoading] = React.useState(true)
    const [isSaving, setIsSaving] = React.useState(false)
    const [file, setFile] = React.useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    // Form states
    const [title, setTitle] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [goal, setGoal] = React.useState("")
    const [pixKey, setPixKey] = React.useState("")
    const [beneficiaryName, setBeneficiaryName] = React.useState("")
    const [currentImageUrl, setCurrentImageUrl] = React.useState<string | null>(null)

    // Fetch Campaign Data
    React.useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    router.push("/login")
                    return
                }

                const { data: campaign, error } = await supabase
                    .from('campaigns')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error || !campaign) {
                    alert("Campanha não encontrada.")
                    router.push("/dashboard")
                    return
                }

                if (campaign.creator_id !== user.id) {
                    alert("Você não tem permissão para editar esta campanha.")
                    router.push("/dashboard")
                    return
                }

                // Populate form
                setTitle(campaign.title)
                setDescription(campaign.description)
                setGoal(campaign.goal.toString())
                setPixKey(campaign.pix_key)
                setBeneficiaryName(campaign.beneficiary_name)

                if (campaign.image_url) {
                    setPreviewUrl(campaign.image_url)
                    setCurrentImageUrl(campaign.image_url)
                }

            } catch (error) {
                console.error("Erro ao carregar campanha:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCampaign()
    }, [id, supabase, router])

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
        if (previewUrl && previewUrl !== currentImageUrl) {
            URL.revokeObjectURL(previewUrl)
        }
        setPreviewUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Usuário não autenticado")

            const numericGoal = parseFloat(goal.replace(/\./g, '').replace(',', '.'))
            if (isNaN(numericGoal) || numericGoal <= 0) {
                throw new Error("O valor da meta é inválido.")
            }

            let imageUrl = currentImageUrl

            // Upload New Image if selected
            if (file) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${user.id}/${Date.now()}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('campaign-images')
                    .upload(fileName, file)

                if (uploadError) throw uploadError

                const { data: publicUrlData } = supabase.storage
                    .from('campaign-images')
                    .getPublicUrl(fileName)

                imageUrl = publicUrlData.publicUrl
            } else if (!previewUrl) {
                // Se removeu a imagem e não selecionou outra
                imageUrl = null
            }

            // Update Campaign
            const { error: updateError } = await supabase
                .from('campaigns')
                .update({
                    title,
                    description,
                    goal: numericGoal,
                    pix_key: pixKey,
                    beneficiary_name: beneficiaryName,
                    image_url: imageUrl,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)

            if (updateError) throw updateError

            alert("Campanha atualizada com sucesso!")
            router.push(`/dashboard/campaign/${id}`)
            router.refresh()

        } catch (error: any) {
            console.error("Erro ao atualizar:", error)
            alert(`Erro ao atualizar campanha: ${error.message || "Erro desconhecido"}`)
        } finally {
            setIsSaving(false)
        }
    }

    const handleFinalize = async () => {
        if (!confirm("Tem certeza que deseja finalizar esta campanha? Ela será marcada como concluída.")) return
        setIsSaving(true)
        try {
            const { error } = await supabase
                .from('campaigns')
                .update({ status: 'completed' })
                .eq('id', id)

            if (error) throw error

            alert("Campanha finalizada com sucesso!")
            router.push("/dashboard")
            router.refresh()
        } catch (error: any) {
            console.error("Erro ao finalizar:", error)
            alert("Erro ao finalizar campanha.")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        const confirmText = prompt("Para confirmar a exclusão, digite 'DELETAR' abaixo:")
        if (confirmText !== "DELETAR") return

        setIsSaving(true)
        try {
            const { error } = await supabase
                .from('campaigns')
                .delete()
                .eq('id', id)

            if (error) throw error

            alert("Campanha excluída permanentemente.")
            router.push("/dashboard")
            router.refresh()
        } catch (error: any) {
            console.error("Erro ao excluir:", error)
            alert("Erro ao excluir campanha.")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="container-custom py-20 text-center">Carregando...</div>
    }

    return (
        <div className="container-custom py-12 max-w-2xl">
            <div className="mb-6">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2 pl-0 hover:pl-2 transition-all">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                </Button>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Editar Campanha</h1>
                    <p className="text-muted-foreground">
                        Atualize as informações da sua vaquinha.
                    </p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>Detalhes da Campanha</CardTitle>
                            <CardDescription>Faça as alterações necessárias.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* ... campos existentes ... */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Título da Campanha</Label>
                                <Input
                                    id="title"
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
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                Trocar
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={handleRemoveImage}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t p-6">
                            <Button variant="ghost" type="button" onClick={() => router.back()}>Cancelar</Button>
                            <Button type="submit" isLoading={isSaving} className="w-full md:w-auto ml-auto">
                                Salvar Alterações
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <Card className="border-red-200 dark:border-red-900">
                    <CardHeader>
                        <CardTitle className="text-red-600 dark:text-red-400">Zona de Perigo</CardTitle>
                        <CardDescription>Ações irreversíveis ou que alteram o status da campanha.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50 dark:bg-red-950/20">
                            <div>
                                <h4 className="font-medium">Finalizar Campanha</h4>
                                <p className="text-sm text-muted-foreground">Marca a campanha como concluída. Não aceitará mais doações.</p>
                            </div>
                            <Button type="button" variant="outline" onClick={handleFinalize} className="border-red-200 hover:bg-red-100 hover:text-red-700">
                                Finalizar
                            </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50 dark:bg-red-950/20">
                            <div>
                                <h4 className="font-medium">Excluir Campanha</h4>
                                <p className="text-sm text-muted-foreground">Remove permanentemente a campanha e todo seu histórico.</p>
                            </div>
                            <Button type="button" variant="destructive" onClick={handleDelete}>
                                Excluir
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
