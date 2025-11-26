import { Button } from "@/components/atoms/Button"
import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"

export default function About() {
    return (
        <div className="container-custom py-12 md:py-20 space-y-16">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">Sobre o Mão Amiga</h1>
                <p className="text-xl text-muted-foreground">
                    Nossa missão é democratizar a solidariedade, conectando quem precisa de ajuda a quem quer ajudar,
                    de forma transparente, rápida e sem custos.
                </p>
            </div>

            {/* Story Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold">Nossa História</h2>
                    <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                        <p>
                            O projeto Mão Amiga nasceu da observação de uma necessidade latente: muitas plataformas de crowdfunding
                            cobram taxas abusivas que diminuem o impacto das doações, ou retêm o dinheiro por longos períodos.
                        </p>
                        <p>
                            Acreditamos que a solidariedade não deve ter pedágio. Por isso, criamos uma plataforma onde
                            a tecnologia serve apenas como ponte, facilitando a conexão direta via Pix entre doador e beneficiário.
                        </p>
                        <p>
                            Somos um projeto open-source, desenvolvido com paixão e compromisso social, visando criar
                            um impacto positivo real na vida das pessoas.
                        </p>
                    </div>
                </div>
                <div className="bg-secondary/30 rounded-3xl p-8 h-full min-h-[400px] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                    <div className="relative z-10 text-center space-y-4">
                        <span className="text-6xl">🤝</span>
                        <h3 className="text-2xl font-bold">Solidariedade sem fronteiras</h3>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="space-y-8">
                <h2 className="text-3xl font-bold text-center">Nossos Valores</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-card p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold mb-2 text-primary">Transparência</h3>
                        <p className="text-muted-foreground">
                            Acreditamos na clareza total. Incentivamos os criadores a prestarem contas e os doadores a acompanharem o impacto.
                        </p>
                    </div>
                    <div className="bg-card p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold mb-2 text-primary">Empatia</h3>
                        <p className="text-muted-foreground">
                            Cada campanha representa uma vida, um sonho ou uma necessidade. Tratamos todas as histórias com respeito e dignidade.
                        </p>
                    </div>
                    <div className="bg-card p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold mb-2 text-primary">Inovação Social</h3>
                        <p className="text-muted-foreground">
                            Usamos a tecnologia para resolver problemas reais, simplificando processos para que a ajuda chegue mais rápido.
                        </p>
                    </div>
                </div>
            </div>

            {/* Team/Contact Section */}
            <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-16 text-center space-y-8">
                <h2 className="text-3xl font-bold">Quem faz acontecer</h2>
                <p className="max-w-2xl mx-auto text-primary-foreground/80 text-lg">
                    Este projeto é mantido por desenvolvedores apaixonados por tecnologia e impacto social.
                    Quer contribuir ou entrar em contato?
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link href="https://github.com/patrickcardosomoraes/maoamiga" target="_blank">
                        <Button variant="secondary" size="lg" className="gap-2">
                            <Github className="h-5 w-5" />
                            GitHub
                        </Button>
                    </Link>
                    <Link href="mailto:contato@maoamiga.com.br">
                        <Button variant="secondary" size="lg" className="gap-2">
                            <Mail className="h-5 w-5" />
                            Contato
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
