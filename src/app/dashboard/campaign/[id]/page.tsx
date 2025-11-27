import { createClient } from "@/lib/supabase-server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import { Button } from "@/components/atoms/Button"
import { ArrowLeft, Download, ExternalLink, FileText } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/pix"

export default async function ManageCampaignPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // 1. Check Auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    // 2. Fetch Campaign & Verify Ownership
    const { data: campaign } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single()

    if (!campaign) notFound()

    if (campaign.creator_id !== user.id) {
        return (
            <div className="container-custom py-20 text-center">
                <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
                <p className="text-muted-foreground">Você não tem permissão para gerenciar esta campanha.</p>
                <Link href="/dashboard">
                    <Button variant="outline" className="mt-4">Voltar ao Painel</Button>
                </Link>
            </div>
        )
    }

    // 3. Fetch Supporters (Donations)
    const { data: supporters } = await supabase
        .from('supporters')
        .select('*')
        .eq('campaign_id', id)
        .order('created_at', { ascending: false })

    return (
        <div className="container-custom py-12 space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gerenciar Campanha</h1>
                    <p className="text-muted-foreground">{campaign.title}</p>
                </div>
                <div className="ml-auto">
                    <Link href={`/dashboard/campaign/${id}/edit`}>
                        <Button variant="outline" className="gap-2">
                            <FileText className="h-4 w-4" />
                            Editar Campanha
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Arrecadado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(campaign.raised)}</div>
                        <p className="text-xs text-muted-foreground">
                            Meta: {formatCurrency(campaign.goal)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total de Apoios</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{supporters?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Doações recebidas</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Doações</CardTitle>
                </CardHeader>
                <CardContent>
                    {supporters && supporters.length > 0 ? (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Data</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Doador</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Valor</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Mensagem</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Comprovante</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {supporters.map((supporter) => (
                                        <tr key={supporter.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle">
                                                {new Date(supporter.created_at).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="p-4 align-middle font-medium">
                                                {supporter.name || "Anônimo"}
                                            </td>
                                            <td className="p-4 align-middle text-green-600 font-bold">
                                                {formatCurrency(supporter.amount)}
                                            </td>
                                            <td className="p-4 align-middle max-w-[300px] truncate" title={supporter.message}>
                                                {supporter.message || "-"}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                {supporter.proof_url ? (
                                                    <a
                                                        href={supporter.proof_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center text-blue-600 hover:underline"
                                                    >
                                                        <FileText className="mr-1 h-4 w-4" />
                                                        Ver Comprovante
                                                    </a>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs">Não enviado</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            Nenhuma doação recebida ainda.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
