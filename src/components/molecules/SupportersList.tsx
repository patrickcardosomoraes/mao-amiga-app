import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"

interface Supporter {
    id: string
    name: string
    amount: number
    message?: string
    date: string
}

interface SupportersListProps {
    supporters: Supporter[]
}

export function SupportersList({ supporters }: SupportersListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Mural de Apoiadores ({supporters.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {supporters.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">Seja o primeiro a apoiar!</p>
                ) : (
                    supporters.map((supporter) => (
                        <div key={supporter.id} className="flex flex-col space-y-1 border-b last:border-0 pb-3 last:pb-0">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{supporter.name}</span>
                                <span className="text-sm text-primary font-semibold">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(supporter.amount)}
                                </span>
                            </div>
                            {supporter.message && (
                                <p className="text-sm text-muted-foreground italic">"{supporter.message}"</p>
                            )}
                            <span className="text-xs text-muted-foreground/60">
                                {new Date(supporter.date).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}
