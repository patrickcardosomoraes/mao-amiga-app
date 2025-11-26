"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { Label } from "@/components/atoms/Label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/atoms/Card"
import { HeartHandshake } from "lucide-react"
import { createClient } from "@/lib/supabase-client"

export default function RegisterPage() {
    const supabase = createClient()
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        // Validações
        if (password !== confirmPassword) {
            setError("As senhas não coincidem")
            setIsLoading(false)
            return
        }

        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres")
            setIsLoading(false)
            return
        }

        try {
            // Criar usuário no Supabase Auth
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name,
                    }
                }
            })

            if (signUpError) {
                setError(signUpError.message)
                return
            }

            if (data.user) {
                // Criar perfil na tabela profiles
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: data.user.id,
                            email: email,
                            name: name,
                        }
                    ])

                if (profileError) {
                    console.error('Error creating profile:', profileError)
                }

                setSuccess(true)

                // Redirecionar após 2 segundos
                setTimeout(() => {
                    router.push("/login")
                }, 2000)
            }
        } catch (err) {
            setError("Erro ao criar conta. Tente novamente.")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-secondary/30">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <HeartHandshake className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
                    <CardDescription>
                        Cadastre-se para começar a criar campanhas
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">
                                Conta criada com sucesso! Redirecionando...
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name">Nome completo</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="João Silva"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={isLoading || success}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading || success}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading || success}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar senha</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Digite a senha novamente"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isLoading || success}
                            />
                        </div>

                        <Button
                            className="w-full"
                            type="submit"
                            isLoading={isLoading}
                            disabled={success}
                        >
                            Criar conta
                        </Button>
                    </CardContent>
                </form>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Já tem uma conta?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Fazer login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
