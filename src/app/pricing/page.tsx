import { Button } from "@/components/atoms/Button"
import Link from "next/link"
import { CheckCircle, Heart } from "lucide-react"

export default function Pricing() {
    return (
        <div className="container-custom py-20 text-center space-y-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                <Heart className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Taxa Zero. Sério.</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                No Mão Amiga, acreditamos que cada centavo doado deve ir para quem precisa.
                Por isso, não cobramos taxas de administração, taxas de saque ou comissões.
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
                <div className="bg-card p-8 rounded-2xl border shadow-sm">
                    <h3 className="text-2xl font-bold mb-4">Para Criadores</h3>
                    <ul className="space-y-3 text-left">
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>Criação de campanha: <strong>R$ 0,00</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>Taxa sobre doações: <strong>0%</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>Taxa de saque: <strong>R$ 0,00</strong> (Pix direto)</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-card p-8 rounded-2xl border shadow-sm">
                    <h3 className="text-2xl font-bold mb-4">Para Doadores</h3>
                    <ul className="space-y-3 text-left">
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>Taxa de serviço: <strong>R$ 0,00</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>Taxa de processamento: <strong>R$ 0,00</strong> (Pix)</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>Proteção e segurança: <strong>Incluso</strong></span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="pt-8">
                <Link href="/create-campaign">
                    <Button size="lg" className="rounded-full px-8">
                        Criar Vaquinha Grátis
                    </Button>
                </Link>
            </div>
        </div>
    )
}
