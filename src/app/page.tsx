import Link from "next/link"
import { Button } from "@/components/atoms/Button"
import { CampaignCard } from "@/components/organisms/CampaignCard"
import { ArrowRight, ShieldCheck, Zap, Heart } from "lucide-react"
import { createClient } from "@/lib/supabase-server"

export const revalidate = 60 // Revalidar a cada 60 segundos

export default async function Home() {
  const supabase = await createClient()

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select(`
      *,
      profiles:creator_id (
        name,
        avatar_url
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(3)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const featuredCampaigns = campaigns?.map((c: any) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    imageUrl: c.image_url || "/placeholder-campaign.jpg",
    goal: Number(c.goal),
    raised: Number(c.raised),
    pixKey: c.pix_key,
    beneficiaryName: c.beneficiary_name,
    createdAt: c.created_at,
    creatorId: c.creator_id,
    creatorName: c.profiles?.name || "Organizador",
    status: c.status
  })) || []

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-background shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Plataforma 100% Gratuita e Segura
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
              Transforme solidariedade em <span className="text-primary">ação real</span>.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Crie sua vaquinha em segundos, receba via Pix instantaneamente e não pague nada por isso. A mão amiga que você precisa.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/create-campaign">
                <Button size="lg" className="h-12 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  Criar minha Vaquinha
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full bg-background/50 backdrop-blur">
                  Explorar Campanhas
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Features / Trust */}
      <section className="py-12 border-y bg-secondary/20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center space-y-3 p-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg">Pix Instantâneo</h3>
              <p className="text-muted-foreground">O dinheiro cai direto na sua conta. Sem intermediários, sem espera.</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg">Segurança Total</h3>
              <p className="text-muted-foreground">Monitoramento de fraudes e proteção de dados para doadores e criadores.</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg">Taxa Zero</h3>
              <p className="text-muted-foreground">Não cobramos nada. 100% do valor doado vai para a causa.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-20">
        <div className="container-custom space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Campanhas em Destaque</h2>
              <p className="text-muted-foreground">Histórias que precisam da sua ajuda agora.</p>
            </div>
            <Link href="/explore">
              <Button variant="ghost" className="group">
                Ver todas
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCampaigns.length > 0 ? (
              featuredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Nenhuma campanha encontrada no momento. Seja o primeiro a criar!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container-custom text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold max-w-2xl mx-auto">
            Pronto para fazer a diferença?
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto text-lg">
            Junte-se a milhares de pessoas que estão mudando o mundo, uma doação de cada vez.
          </p>
          <Link href="/create-campaign">
            <Button size="lg" variant="secondary" className="h-12 px-8 text-lg rounded-full shadow-lg">
              Começar Agora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
