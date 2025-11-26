"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/atoms/Button"
import { HeartHandshake, Menu, X, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { User } from "@supabase/supabase-js"

export function Navbar() {
    const supabase = useMemo(() => createClient(), [])
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        // Check current user
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container-custom flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <HeartHandshake className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                    <span className="text-lg md:text-xl font-bold tracking-tight text-primary">mão amiga</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/explore" className="transition-colors hover:text-primary">
                        Explorar
                    </Link>
                    <Link href="/how-it-works" className="transition-colors hover:text-primary">
                        Como Funciona
                    </Link>
                    <Link href="/about" className="transition-colors hover:text-primary">
                        Sobre
                    </Link>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <>
                            <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
                                Dashboard
                            </Link>
                            <Link href="/create-campaign">
                                <Button size="sm">Criar Vaquinha</Button>
                            </Link>
                            <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
                                Entrar
                            </Link>
                            <Link href="/create-campaign">
                                <Button size="sm">Criar Vaquinha</Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t bg-background">
                    <nav className="container-custom py-4 flex flex-col space-y-4">
                        <Link
                            href="/explore"
                            className="text-sm font-medium hover:text-primary py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Explorar
                        </Link>
                        <Link
                            href="/how-it-works"
                            className="text-sm font-medium hover:text-primary py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Como Funciona
                        </Link>
                        <Link
                            href="/about"
                            className="text-sm font-medium hover:text-primary py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Sobre
                        </Link>

                        <div className="pt-4 border-t space-y-3">
                            {user ? (
                                <>
                                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="outline" className="w-full">
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Link href="/create-campaign" onClick={() => setIsMenuOpen(false)}>
                                        <Button className="w-full">
                                            Criar Vaquinha
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        className="w-full"
                                        onClick={() => {
                                            handleLogout()
                                            setIsMenuOpen(false)
                                        }}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sair
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="outline" className="w-full">
                                            Entrar
                                        </Button>
                                    </Link>
                                    <Link href="/create-campaign" onClick={() => setIsMenuOpen(false)}>
                                        <Button className="w-full">
                                            Criar Vaquinha
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}
