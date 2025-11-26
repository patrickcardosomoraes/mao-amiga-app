import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/atoms/Card"
import { Progress } from "@/components/atoms/Progress"
import { Campaign } from "@/types"
import { formatCurrency } from "@/lib/pix"
import { Heart } from "lucide-react"

interface CampaignCardProps {
    campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
    const percentage = Math.round((campaign.raised / campaign.goal) * 100)

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-none shadow-md bg-white dark:bg-zinc-900">
            <div className="aspect-video w-full bg-gray-100 relative overflow-hidden">
                {campaign.imageUrl ? (
                    <img
                        src={campaign.imageUrl}
                        alt={campaign.title}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground bg-secondary">
                        Sem imagem
                    </div>
                )}
            </div>
            <CardHeader className="p-4 pb-2">
                <h3 className="font-bold text-lg leading-tight line-clamp-2 hover:text-primary transition-colors">
                    <Link href={`/campaign/${campaign.id}`}>
                        {campaign.title}
                    </Link>
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {campaign.description}
                </p>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
                <div className="space-y-1">
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-primary">{formatCurrency(campaign.raised)}</span>
                        <span className="text-muted-foreground">de {formatCurrency(campaign.goal)}</span>
                    </div>
                    <Progress value={campaign.raised} max={campaign.goal} className="h-2" />
                    <p className="text-xs text-right text-muted-foreground font-medium">{percentage}%</p>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Link
                    href={`/campaign/${campaign.id}`}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full gap-2"
                >
                    <Heart className="w-4 h-4 fill-current" />
                    Apoiar Agora
                </Link>
            </CardFooter>
        </Card>
    )
}
