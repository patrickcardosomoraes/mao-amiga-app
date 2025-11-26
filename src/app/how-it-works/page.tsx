import { Button } from "@/components/atoms/Button"
import Link from "next/link"
import { ArrowRight, CheckCircle, Heart, Share2, Wallet } from "lucide-react"

export default function HowItWorks() {
    return (
        <div className="container-custom py-12 md:py-20 space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">Como Funciona</h1>
                <p className="text-xl text-muted-foreground">
                    Criar uma vaquinha no Mão Amiga é simples, rápido e totalmente gratuito.
                    Veja como você pode começar a fazer a diferença hoje mesmo.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Connecting line for desktop */}
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-border -z-10" />

                <div className="bg-card p-8 rounded-2xl border shadow-sm relative">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto md:mx-0 relative z-10">
                        1
                    </div>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        Crie sua Campanha
                    </h3>
                    <p className="text-muted-foreground">
                        Conte sua história, defina uma meta financeira e adicione fotos ou vídeos.
                        É importante ser transparente e detalhar como o dinheiro será usado.
                    </p>
                </div>

                <div className="bg-card p-8 rounded-2xl border shadow-sm relative">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto md:mx-0 relative z-10">
                        2
                    </div>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                        <Share2 className="h-5 w-5 text-primary" />
                        Compartilhe
                    </h3>
                    <p className="text-muted-foreground">
                        Divulgue sua vaquinha para amigos, familiares e nas redes sociais.
                        Quanto mais pessoas souberem, maiores as chances de atingir sua meta.
                    </p>
                </div>

                <div className="bg-card p-8 rounded-2xl border shadow-sm relative">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto md:mx-0 relative z-10">
                        3
                    </div>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-primary" />
                        Receba via Pix
                    </h3>
                    <p className="text-muted-foreground">
                        As doações caem diretamente na conta cadastrada via Pix.
                        Sem taxas de plataforma, sem intermediários e com disponibilidade imediata.
                    </p>
                </div>
            </div>

            <div className="bg-secondary/20 rounded-3xl p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">Por que escolher o Mão Amiga?</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                                <div>
                                    <span className="font-semibold block">Taxa Zero</span>
                                    <span className="text-muted-foreground">Não cobramos nenhuma taxa sobre as doações. 100% do valor vai para você.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                                <div>
                                    <span className="font-semibold block">Segurança e Transparência</span>
                                    <span className="text-muted-foreground">Validamos os usuários e oferecemos ferramentas para garantir a legitimidade das campanhas.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                                <div>
                                    <span className="font-semibold block">Pix Instantâneo</span>
                                    <span className="text-muted-foreground">O dinheiro não fica preso na plataforma. Receba na hora.</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-background p-8 rounded-2xl shadow-lg border text-center space-y-6">
                        <h3 className="text-2xl font-bold">Pronto para começar?</h3>
                        <p className="text-muted-foreground">
                            Não leva nem 2 minutos para colocar sua campanha no ar e começar a receber apoio.
                        </p>
                        <Link href="/create-campaign" className="block">
                            <Button size="lg" className="w-full h-12 text-lg rounded-full">
                                Criar Vaquinha Agora
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
