"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/atoms/Input"
import { Search } from "lucide-react"


export function SearchInput() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialSearch = searchParams.get("q") || ""
    const [term, setTerm] = React.useState(initialSearch)

    // Debounce manual simples
    React.useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (term) {
                params.set("q", term)
            } else {
                params.delete("q")
            }
            router.push(`/explore?${params.toString()}`)
        }, 500) // Espera 500ms após parar de digitar

        return () => clearTimeout(timer)
    }, [term, router, searchParams])

    return (
        <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Buscar por título ou descrição..."
                className="pl-9"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
            />
        </div>
    )
}
