# Mão Amiga - Documentação Técnica

## 📋 Índice

1. [Arquitetura](#arquitetura)
2. [Componentes](#componentes)
3. [Banco de Dados](#banco-de-dados)
4. [API & Server Actions](#api--server-actions)
5. [Autenticação](#autenticação)
6. [Upload de Arquivos](#upload-de-arquivos)
7. [Segurança](#segurança)
8. [Deploy](#deploy)

## 🏗️ Arquitetura

### Stack Tecnológica

- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: TailwindCSS 4 + CSS Variables
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Pagamentos**: Pix (QR Code Generator)
- **Hospedagem**: Vercel (recomendado)

### Padrões de Design

- **Atomic Design**: Organização de componentes em atoms, molecules, organisms
- **Server Actions**: Operações de banco de dados no servidor
- **SSR/SSG**: Renderização otimizada para SEO
- **Type Safety**: TypeScript em todo o projeto

## 🧩 Componentes

### Atoms (Componentes Básicos)

```typescript
// Button.tsx - Botão com variantes e loading state
<Button variant="default" size="lg" isLoading={false}>
  Criar Vaquinha
</Button>

// Input.tsx - Input com validação
<Input type="email" placeholder="seu@email.com" />

// Card.tsx - Container com header, content, footer
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>Conteúdo</CardContent>
</Card>
```

### Molecules (Componentes Compostos)

```typescript
// PixQRCode.tsx - QR Code com botões de ação
<PixQRCode 
  pixKey="email@example.com"
  beneficiaryName="João Silva"
  amount={100}
  description="Doação"
/>

// SupportersList.tsx - Lista de apoiadores
<SupportersList supporters={supportersArray} />
```

### Organisms (Componentes Complexos)

```typescript
// CampaignCard.tsx - Card de campanha
<CampaignCard campaign={campaignData} />

// Navbar.tsx - Navegação principal
<Navbar />

// Footer.tsx - Rodapé
<Footer />
```

## 🗄️ Banco de Dados

### Tabelas Principais

#### profiles
```sql
- id (UUID, PK)
- email (TEXT, UNIQUE)
- name (TEXT)
- avatar_url (TEXT)
- created_at (TIMESTAMP)
```

#### campaigns
```sql
- id (UUID, PK)
- creator_id (UUID, FK -> profiles)
- title (TEXT)
- description (TEXT)
- image_url (TEXT)
- video_url (TEXT)
- goal (DECIMAL)
- raised (DECIMAL)
- pix_key (TEXT)
- beneficiary_name (TEXT)
- status (TEXT: active, paused, completed, reported)
- created_at (TIMESTAMP)
```

#### supporters
```sql
- id (UUID, PK)
- campaign_id (UUID, FK -> campaigns)
- name (TEXT)
- amount (DECIMAL)
- message (TEXT)
- created_at (TIMESTAMP)
```

### Row Level Security (RLS)

Todas as tabelas possuem políticas RLS:

- **Leitura pública**: Campanhas e apoiadores visíveis para todos
- **Escrita autenticada**: Apenas usuários logados podem criar
- **Modificação própria**: Usuários só editam seus próprios dados

## 🔌 API & Server Actions

### Server Actions (src/lib/actions.ts)

```typescript
// Buscar campanhas
const campaigns = await getCampaigns()

// Buscar campanha específica
const campaign = await getCampaignById(id)

// Criar campanha
const result = await createCampaign({
  title: "...",
  description: "...",
  goal: 1000,
  pixKey: "...",
  beneficiaryName: "...",
  creatorId: userId
})

// Adicionar apoiador
await addSupporter({
  campaignId: "...",
  name: "João",
  amount: 50,
  message: "Boa sorte!"
})

// Rastrear evento
await trackEvent(campaignId, 'view')
```

## 🔐 Autenticação

### Supabase Auth

```typescript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Cadastro
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})

// Social Login (Google, Facebook)
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
})

// Logout
await supabase.auth.signOut()
```

### Proteção de Rotas

```typescript
// middleware.ts (exemplo)
export async function middleware(request: NextRequest) {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
```

## 📤 Upload de Arquivos

### Storage Buckets

- `campaign-images`: Imagens de campanhas
- `avatars`: Fotos de perfil

### Upload de Imagem

```typescript
const file = event.target.files[0]
const fileExt = file.name.split('.').pop()
const fileName = `${Math.random()}.${fileExt}`
const filePath = `${userId}/${fileName}`

const { data, error } = await supabase.storage
  .from('campaign-images')
  .upload(filePath, file)

const { data: { publicUrl } } = supabase.storage
  .from('campaign-images')
  .getPublicUrl(filePath)
```

### Validações

- **Tamanho máximo**: 10MB
- **Formatos aceitos**: JPG, PNG, WEBP, MP4
- **Compressão**: Automática via Next.js Image

## 🛡️ Segurança

### Validação de Inputs

```typescript
// Exemplo de validação
function validateCampaignData(data: any) {
  if (!data.title || data.title.length < 5) {
    throw new Error('Título muito curto')
  }
  if (data.goal < 0) {
    throw new Error('Meta inválida')
  }
  // ... mais validações
}
```

### Sanitização

```typescript
import DOMPurify from 'isomorphic-dompurify'

const cleanDescription = DOMPurify.sanitize(userInput)
```

### Rate Limiting

Configurado no Supabase:
- 100 requisições/minuto por IP
- 1000 requisições/hora por usuário autenticado

### LGPD Compliance

- ✅ Consentimento explícito
- ✅ Direito ao esquecimento
- ✅ Portabilidade de dados
- ✅ Criptografia em trânsito e repouso

## 🚀 Deploy

### Vercel

1. Conecte o repositório GitHub
2. Configure as variáveis de ambiente
3. Deploy automático em cada push

```bash
vercel --prod
```

### Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Otimizações de Produção

- ✅ Minificação automática
- ✅ Code splitting
- ✅ Image optimization
- ✅ CDN global (Vercel Edge)
- ✅ Caching agressivo

## 📊 Monitoramento

### Analytics

- **Vercel Analytics**: Performance e Web Vitals
- **Supabase Dashboard**: Queries e uso de banco
- **Custom Events**: Rastreamento de conversão

### Logs

```typescript
// Exemplo de logging
console.error('Error creating campaign:', {
  userId,
  error: error.message,
  timestamp: new Date().toISOString()
})
```

## 🧪 Testes

### Testes Unitários (Exemplo)

```typescript
// __tests__/utils.test.ts
import { formatCurrency } from '@/lib/pix'

test('formats currency correctly', () => {
  expect(formatCurrency(1000)).toBe('R$ 1.000,00')
})
```

### Testes E2E (Exemplo com Playwright)

```typescript
test('create campaign flow', async ({ page }) => {
  await page.goto('/create-campaign')
  await page.fill('#title', 'Test Campaign')
  await page.fill('#description', 'Test description')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/\/campaign\//)
})
```

## 📝 Convenções de Código

### Naming

- **Componentes**: PascalCase (`CampaignCard.tsx`)
- **Funções**: camelCase (`getCampaigns()`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Arquivos**: kebab-case para páginas (`create-campaign/`)

### Comentários

```typescript
/**
 * Fetches all active campaigns from the database
 * @returns Array of Campaign objects
 */
export async function getCampaigns(): Promise<Campaign[]> {
  // Implementation
}
```

---

**Desenvolvido com ❤️ e boas práticas**
