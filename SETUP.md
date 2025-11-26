# 🚀 Guia de Setup Completo - Mão Amiga

## ✅ Checklist de Configuração

### Passo 1: Variáveis de Ambiente ✅ (FEITO)
- [x] Criar arquivo `.env.local` ou `.env`
- [x] Adicionar `NEXT_PUBLIC_SUPABASE_URL`
- [x] Adicionar `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### Passo 2: Configurar Banco de Dados no Supabase

#### 2.1 Executar Schema SQL

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Menu lateral → **SQL Editor**
4. Clique em **New Query**
5. Copie TODO o conteúdo de `supabase/schema.sql`
6. Cole no editor
7. Clique em **Run** (ou Ctrl/Cmd + Enter)
8. ✅ Deve aparecer "Success. No rows returned"

#### 2.2 Verificar Tabelas Criadas

1. Menu lateral → **Table Editor**
2. Você deve ver estas tabelas:
   - ✅ profiles
   - ✅ campaigns
   - ✅ supporters
   - ✅ reports
   - ✅ campaign_analytics

---

### Passo 3: Configurar Storage (Upload de Imagens)

#### 3.1 Criar Buckets

1. Menu lateral → **Storage**
2. Clique em **New bucket**
3. Criar bucket `campaign-images`:
   - Nome: `campaign-images`
   - ✅ Marcar como **Public**
   - Clique em **Create bucket**
4. Criar bucket `avatars`:
   - Nome: `avatars`
   - ✅ Marcar como **Public**
   - Clique em **Create bucket**

#### 3.2 Configurar Políticas de Storage

Para cada bucket, adicione as políticas:

**No bucket `campaign-images`:**

1. Clique no bucket → **Policies** → **New Policy**
2. **Política de Leitura Pública:**
   - Template: "Allow public read access"
   - Ou cole este SQL:
   ```sql
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING ( bucket_id = 'campaign-images' );
   ```

3. **Política de Upload Autenticado:**
   - Template: "Allow authenticated uploads"
   - Ou cole este SQL:
   ```sql
   CREATE POLICY "Authenticated users can upload"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'campaign-images' 
     AND auth.role() = 'authenticated'
   );
   ```

**Repita o mesmo para o bucket `avatars`** (substituindo 'campaign-images' por 'avatars')

---

### Passo 4: Configurar Autenticação

#### 4.1 Email/Password (Já ativo por padrão) ✅

#### 4.2 Social Login (Opcional)

**Google OAuth:**
1. Menu lateral → **Authentication** → **Providers**
2. Encontre **Google** → Clique em **Enable**
3. Você precisará:
   - Google Client ID
   - Google Client Secret
   - (Obtenha em: https://console.cloud.google.com)

**Facebook OAuth:**
1. Mesmo processo, mas com credenciais do Facebook
2. (Obtenha em: https://developers.facebook.com)

---

### Passo 5: Criar Usuário de Teste

#### 5.1 Via Interface do Supabase

1. Menu lateral → **Authentication** → **Users**
2. Clique em **Add user** → **Create new user**
3. Preencha:
   - Email: `teste@maoamiga.com`
   - Password: `senha123` (ou qualquer senha)
   - ✅ Marcar "Auto Confirm User"
4. Clique em **Create user**
5. **COPIE O UUID DO USUÁRIO** (você vai precisar!)

---

### Passo 6: Popular com Dados de Teste (Opcional)

#### 6.1 Executar Seed Data

1. Abra o arquivo `supabase/seed.sql`
2. **SUBSTITUA** `'SEU-USER-ID-AQUI'` pelo UUID do usuário que você criou
3. Copie todo o conteúdo
4. No Supabase → **SQL Editor** → **New Query**
5. Cole e execute
6. ✅ Agora você tem campanhas de exemplo!

---

### Passo 7: Testar a Aplicação

#### 7.1 Verificar se está rodando

```bash
# No terminal, dentro da pasta mao-amiga
npm run dev
```

Deve abrir em: http://localhost:3001 (ou 3000)

#### 7.2 Testar Funcionalidades

**Teste 1: Home Page**
- ✅ Acesse http://localhost:3001
- ✅ Deve ver o hero com "Transforme solidariedade em ação real"
- ✅ Deve ver 3 campanhas em destaque (se executou o seed)

**Teste 2: Explorar Campanhas**
- ✅ Clique em "Explorar Campanhas"
- ✅ Deve listar todas as campanhas

**Teste 3: Detalhes da Campanha**
- ✅ Clique em uma campanha
- ✅ Deve ver o QR Code Pix
- ✅ Teste o botão "Copiar Código Pix"
- ✅ Teste o botão de compartilhar

**Teste 4: Login**
- ✅ Clique em "Entrar" no menu
- ✅ Use o email/senha do usuário de teste
- ✅ Deve fazer login com sucesso

**Teste 5: Criar Campanha**
- ✅ Após login, clique em "Criar Vaquinha"
- ✅ Preencha o formulário
- ✅ Clique em "Lançar Campanha"

---

## 🐛 Troubleshooting

### Erro: "Failed to fetch"
**Causa:** Variáveis de ambiente incorretas
**Solução:** 
1. Verifique se o arquivo `.env.local` existe
2. Confirme que as URLs estão corretas
3. Reinicie o servidor: `Ctrl+C` e `npm run dev`

### Erro: "relation does not exist"
**Causa:** Schema não foi executado
**Solução:** Execute o `schema.sql` no SQL Editor do Supabase

### Erro: "Row Level Security policy violation"
**Causa:** RLS está bloqueando a operação
**Solução:** 
1. Verifique se as políticas foram criadas corretamente
2. Confirme que o usuário está autenticado (para operações que exigem auth)

### Erro: "Storage bucket not found"
**Causa:** Buckets não foram criados
**Solução:** Crie os buckets `campaign-images` e `avatars` no Storage

---

## 📊 Verificação Final

Antes de considerar o setup completo, verifique:

- [ ] ✅ Servidor rodando sem erros
- [ ] ✅ Home page carrega corretamente
- [ ] ✅ Campanhas aparecem na lista
- [ ] ✅ QR Code Pix é gerado
- [ ] ✅ Login funciona
- [ ] ✅ Criar campanha funciona
- [ ] ✅ Upload de imagem funciona (se testado)

---

## 🎉 Próximos Passos

Agora que está tudo funcionando:

1. **Personalize o design:**
   - Edite cores em `src/app/globals.css`
   - Adicione seu logo

2. **Configure domínio personalizado:**
   - No Vercel: Settings → Domains

3. **Ative analytics:**
   - Vercel Analytics
   - Google Analytics (opcional)

4. **Configure email transacional:**
   - Supabase → Authentication → Email Templates
   - Configure SMTP customizado (opcional)

5. **Implemente funcionalidades extras:**
   - Notificações por email
   - Sistema de badges para doadores
   - Ranking de campanhas
   - Filtros avançados

---

**🚀 Está tudo pronto! Boa sorte com a Mão Amiga!**
