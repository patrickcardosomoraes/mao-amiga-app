import { CampaignCard } from "@/components/organisms/CampaignCard"
import { Campaign } from "@/types"
import { Input } from "@/components/atoms/Input"
import { Button } from "@/components/atoms/Button"
import { Search } from "lucide-react"

// Mock Data (Duplicated for demo simplicity)
const campaigns: Campaign[] = [
    {
        id: "1",
        title: "Reconstrução da Casa da Dona Maria",
        description: "Ajude a Dona Maria a reconstruir sua casa que foi afetada pelas chuvas.",
        imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000&auto=format&fit=crop",
        goal: 15000,
        raised: 8750,
        pixKey: "email@example.com",
        beneficiaryName: "Maria da Silva",
        createdAt: "2023-10-01",
        creatorId: "user1",
        status: 'active'
    },
    {
        id: "2",
        title: "Cirurgia de Emergência do Rex",
        description: "O Rex precisa de uma cirurgia urgente na pata.",
        imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000&auto=format&fit=crop",
        goal: 3000,
        raised: 1200,
        pixKey: "12345678900",
        beneficiaryName: "Abrigo Animal",
        createdAt: "2023-10-05",
        creatorId: "user2",
        status: 'active'
    },
    {
        id: "3",
        title: "Horta Comunitária do Bairro",
        description: "Vamos criar uma horta para alimentar 50 famílias carentes.",
        imageUrl: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=1000&auto=format&fit=crop",
        goal: 5000,
        raised: 4800,
        pixKey: "horta@comunidade.org",
        beneficiaryName: "Associação de Moradores",
        createdAt: "2023-10-10",
        creatorId: "user3",
        status: 'active'
    },
    {
        id: "4",
        title: "Livros para a Escola Municipal",
        description: "Queremos renovar a biblioteca da escola do bairro.",
        imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000&auto=format&fit=crop",
        goal: 2000,
        raised: 150,
        pixKey: "escola@edu.br",
        beneficiaryName: "Escola Municipal",
        createdAt: "2023-10-15",
        creatorId: "user4",
        status: 'active'
    },
    {
        id: "5",
        title: "Cadeira de Rodas para o João",
        description: "João precisa de uma cadeira de rodas adaptada para ir à escola.",
        imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop",
        goal: 8000,
        raised: 6000,
        pixKey: "joao@email.com",
        beneficiaryName: "João da Silva",
        createdAt: "2023-10-20",
        creatorId: "user5",
        status: 'active'
    }
]

export default function ExplorePage() {
    return (
        <div className="container-custom py-12 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Explorar Campanhas</h1>
                <div className="flex w-full md:w-auto gap-2">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar causas..." className="pl-9" />
                    </div>
                    <Button>Buscar</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
            </div>
        </div>
    )
}
