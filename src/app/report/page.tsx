import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { Label } from "@/components/atoms/Label"
import { Textarea } from "@/components/atoms/Textarea"

export default function Report() {
    return (
        <div className="container-custom py-12 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Denunciar Campanha</h1>
            <p className="text-muted-foreground mb-8">
                Se você identificou uma campanha fraudulenta ou que viola nossos termos, por favor nos avise.
                Sua denúncia é anônima.
            </p>

            <form className="space-y-6 border p-6 rounded-xl bg-card">
                <div className="space-y-2">
                    <Label htmlFor="url">Link da Campanha</Label>
                    <Input id="url" placeholder="https://maoamiga.com.br/campaign/..." />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="reason">Motivo da Denúncia</Label>
                    <Textarea id="reason" placeholder="Descreva por que esta campanha deve ser investigada..." className="min-h-[120px]" />
                </div>

                <Button className="w-full">Enviar Denúncia</Button>
            </form>
        </div>
    )
}
