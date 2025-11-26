# 🔐 Guia de Teste - Autenticação

## ✅ O que foi implementado:

1. **Página de Login** (`/login`)
   - Login com email/senha
   - Login com Google (OAuth)
   - Mensagens de erro
   - Loading states

2. **Página de Registro** (`/register`)
   - Cadastro com nome, email e senha
   - Validação de senha
   - Criação automática de perfil
   - Redirecionamento após sucesso

3. **Callback OAuth** (`/auth/callback`)
   - Processa login social
   - Cria perfil automaticamente
   - Redireciona para dashboard

---

## 🧪 Como Testar:

### Opção 1: Criar Nova Conta

1. Acesse: http://localhost:3001/register
2. Preencha:
   - Nome: `Teste User`
   - Email: `teste@maoamiga.com`
   - Senha: `senha123`
   - Confirmar senha: `senha123`
3. Clique em **"Criar conta"**
4. Aguarde mensagem de sucesso
5. Será redirecionado para `/login`
6. Faça login com as credenciais criadas

### Opção 2: Usar Usuário Existente

Se você já criou um usuário no Supabase:

1. Acesse: http://localhost:3001/login
2. Digite o email e senha do usuário
3. Clique em **"Entrar"**
4. Será redirecionado para `/dashboard`

### Opção 3: Login com Google (Requer configuração)

1. Configure Google OAuth no Supabase primeiro
2. Clique em **"Google"** na página de login
3. Autorize no popup do Google
4. Será redirecionado automaticamente

---

## ⚠️ Possíveis Erros e Soluções:

### "Invalid login credentials"
**Causa:** Email ou senha incorretos
**Solução:** Verifique as credenciais ou crie nova conta

### "User already registered"
**Causa:** Email já cadastrado
**Solução:** Use outro email ou faça login

### "Failed to fetch"
**Causa:** Problema de conexão com Supabase
**Solução:** 
1. Verifique se `.env` tem as credenciais corretas
2. Verifique se o Supabase está online
3. Reinicie o servidor: `Ctrl+C` e `npm run dev`

### "Email not confirmed"
**Causa:** Supabase requer confirmação de email
**Solução:** 
1. Vá em Supabase → Authentication → Email Templates
2. Desative "Confirm email" para desenvolvimento
3. OU confirme o email manualmente no Supabase

---

## 🔧 Configurações Recomendadas no Supabase:

### Para Desenvolvimento:

1. **Desativar confirmação de email:**
   - Authentication → Settings
   - Desmarque "Enable email confirmations"

2. **Configurar URL de redirecionamento:**
   - Authentication → URL Configuration
   - Site URL: `http://localhost:3001`
   - Redirect URLs: `http://localhost:3001/auth/callback`

3. **Habilitar Google OAuth (opcional):**
   - Authentication → Providers
   - Ative "Google"
   - Configure Client ID e Secret

---

## 📝 Fluxo de Autenticação:

```
REGISTRO:
1. Usuário preenche formulário → /register
2. Supabase cria usuário em auth.users
3. App cria perfil em public.profiles
4. Redireciona para /login
5. Usuário faz login
6. Redireciona para /dashboard

LOGIN:
1. Usuário digita credenciais → /login
2. Supabase valida
3. Cria sessão
4. Redireciona para /dashboard

OAUTH:
1. Usuário clica em "Google" → /login
2. Popup do Google abre
3. Usuário autoriza
4. Redireciona para /auth/callback
5. Callback cria perfil se necessário
6. Redireciona para /dashboard
```

---

## 🎯 Próximos Passos:

Depois de testar o login:

1. **Proteger rotas:**
   - Criar middleware para verificar autenticação
   - Redirecionar não-autenticados para /login

2. **Implementar logout:**
   - Botão de logout no navbar
   - Limpar sessão

3. **Melhorar dashboard:**
   - Mostrar nome do usuário
   - Listar campanhas do usuário
   - Permitir edição de perfil

---

## ✅ Checklist de Teste:

- [ ] Criar nova conta funciona
- [ ] Login com email/senha funciona
- [ ] Mensagens de erro aparecem corretamente
- [ ] Redirecionamento após login funciona
- [ ] Perfil é criado na tabela profiles
- [ ] Loading states aparecem durante requisições

---

**Teste agora e me avise se funcionar! 🚀**
