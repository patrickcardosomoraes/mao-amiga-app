# 🤝 Mão Amiga - Plataforma de Crowdfunding Social

[![GitHub](https://img.shields.io/badge/GitHub-patrickcardosomoraes%2Fmaoamiga-blue?logo=github)](https://github.com/patrickcardosomoraes/maoamiga/)

Uma plataforma moderna de vaquinhas online com **taxa zero**, focada em solidariedade e transparência. Receba doações via Pix instantaneamente!

🔗 **Repositório**: [https://github.com/patrickcardosomoraes/maoamiga/](https://github.com/patrickcardosomoraes/maoamiga/)

## 🚀 Tecnologias

- **Next.js 16** (React 19, TypeScript, App Router)
- **Supabase** (PostgreSQL, Auth, Storage, API REST)
- **TailwindCSS 4** (Design responsivo e moderno)
- **QR Code Generator** (Pix instantâneo)
- **Lucide Icons** (Ícones modernos)
- **Framer Motion** (Animações suaves)

## ✨ Funcionalidades

### Principais
- ✅ Cadastro e login (email/senha + social login)
- ✅ Criação de campanhas com título, descrição e meta
- ✅ Upload de imagens ou links de vídeo (YouTube/TikTok)
- ✅ Campo para chave Pix (email, telefone, CPF ou aleatória)
- ✅ Geração dinâmica de QR Code Pix
- ✅ Botão "copiar chave" e "compartilhar" (Web Share API)
- ✅ Página pública de cada campanha
- ✅ Mural de comentários/apoiadores
- ✅ Dashboard do usuário
- ✅ Sistema de denúncia de campanhas

### Design & UX
- 🎨 Visual minimalista e moderno (inspiração ibérica)
- 🌓 Dark/Light mode automático
- 📱 Mobile-first e totalmente responsivo
- ⚡ Performance otimizada (SSR + API Routes)
- 🔒 Segurança robusta (validação client/server)

## 📦 Estrutura do Projeto

```
mao-amiga/
├── src/
│   ├── app/                    # Pages (App Router)
│   │   ├── campaign/[id]/     # Página da campanha
│   │   ├── create-campaign/   # Criar vaquinha
│   │   ├── dashboard/         # Painel do usuário
│   │   ├── explore/           # Explorar campanhas
│   │   ├── login/             # Login
│   │   └── page.tsx           # Home
│   ├── components/
│   │   ├── atoms/             # Componentes básicos
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Progress.tsx
│   │   │   ├── Label.tsx
│   │   │   └── Textarea.tsx
│   │   ├── molecules/         # Componentes compostos
│   │   │   ├── PixQRCode.tsx
│   │   │   └── SupportersList.tsx
│   │   └── organisms/         # Componentes complexos
│   │       ├── CampaignCard.tsx
│   │       ├── Navbar.tsx
│   │       └── Footer.tsx
│   ├── lib/                   # Utilitários
│   │   ├── supabase.ts       # Cliente Supabase
│   │   ├── pix.ts            # Gerador Pix
│   │   └── utils.ts          # Helpers
│   └── types/                 # TypeScript types
│       └── index.ts
├── public/                    # Assets estáticos
└── .env.local                # Variáveis de ambiente
```

## 🛠️ Setup Local

### 1. Clone e instale dependências

```bash
git clone https://github.com/patrickcardosomoraes/maoamiga.git
cd maoamiga/mao-amiga
npm install
```

### 2. Configure o Supabase

Crie um projeto em [supabase.com](https://supabase.com) e copie as credenciais.

Crie o arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 3. Execute o schema SQL no Supabase

Acesse o SQL Editor no Supabase e execute o schema (veja `supabase/schema.sql`).

### 4. Rode o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🗄️ Schema do Banco de Dados

```sql
-- Ver arquivo supabase/schema.sql para o schema completo
```

## 🎨 Design System

### Cores (Paleta Ibérica)

- **Primary**: `#0f4c81` (Azul Azulejo)
- **Accent**: `#ea580c` (Terracota)
- **Background**: `#fafafa` (Branco Quente)
- **Foreground**: `#1a1a1a`

### Componentes Atômicos

Seguimos o padrão **Atomic Design**:
- **Atoms**: Button, Input, Card, Label, etc.
- **Molecules**: PixQRCode, SupportersList
- **Organisms**: CampaignCard, Navbar, Footer
- **Templates**: Layouts de página
- **Pages**: Páginas completas

## 🔐 Segurança

- ✅ Validação client-side e server-side
- ✅ Sanitização de inputs
- ✅ Rate limiting (Supabase)
- ✅ Upload seguro com validação de tipo/tamanho
- ✅ Proteção contra XSS e CSRF
- ✅ LGPD compliant

## 📱 SEO & Performance

- ✅ Meta tags otimizadas
- ✅ Open Graph para compartilhamento
- ✅ Server-Side Rendering (SSR)
- ✅ Image optimization (Next.js Image)
- ✅ Code splitting automático
- ✅ Lazy loading

## 🚀 Deploy

### Vercel (Recomendado)

```bash
npm run build
vercel --prod
```

Configure as variáveis de ambiente no painel da Vercel.

### Outras plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 📄 Licença

MIT License - Sinta-se livre para usar em seus projetos!

## 🤝 Contribuindo

Contribuições são bem-vindas! Abra uma issue ou PR.

---

**Desenvolvido com ❤️ para fazer a diferença**
