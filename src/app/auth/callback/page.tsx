
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"

export default function AuthCallbackPage() {
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const handleCallback = async () => {
            const { data: { session }, error } = await supabase.auth.getSession()

            if (error) {
                console.error('Error during auth callback:', error)
                router.push('/login?error=auth_failed')
                return
            }

            if (session) {
                // Criar perfil se não existir
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('id', session.user.id)
                    .single()

                if (!profile) {
                    await supabase
                        .from('profiles')
                        .insert([
                            {
                                id: session.user.id,
                                email: session.user.email,
                                name: session.user.user_metadata.full_name || session.user.user_metadata.name,
                                avatar_url: session.user.user_metadata.avatar_url,
                            }
                        ])
                }

                router.push('/dashboard')
            } else {
                router.push('/login')
            }
        }

        handleCallback()
    }, [router])

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Autenticando...</p>
            </div>
        </div>
    )
}
