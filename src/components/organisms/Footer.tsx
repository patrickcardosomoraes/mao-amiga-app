import Link from "next/link"
import { HeartHandshake } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t bg-secondary/30 mt-8">
            <div className="container-custom py-8 md:py-12 lg:py-16">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <HeartHandshake className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                            <span className="text-base md:text-lg font-bold text-primary">mão amiga</span>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            A plataforma de crowdfunding social mais simples e transparente do Brasil. Taxa zero, solidariedade 100%.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Plataforma</h4>
                        <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                            <li><Link href="/explore" className="hover:text-primary transition-colors">Explorar Campanhas</Link></li>
                            <li><Link href="/how-it-works" className="hover:text-primary transition-colors">Como Funciona</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">Sobre Nós</Link></li>
                            <li><Link href="/pricing" className="hover:text-primary transition-colors">Taxas (Zero!)</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Legal</h4>
                        <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacidade</Link></li>
                            <li><Link href="/lgpd" className="hover:text-primary transition-colors">LGPD</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Contato</h4>
                        <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                            <li><a href="mailto:ajuda@maoamiga.com.br" className="hover:text-primary transition-colors">ajuda@maoamiga.com.br</a></li>
                            <li><Link href="/report" className="hover:text-primary transition-colors">Denunciar Campanha</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 md:mt-12 border-t pt-6 md:pt-8 text-center text-xs md:text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Mão Amiga. Todos os direitos reservados.
                </div>
            </div>
        </footer>
    )
}
