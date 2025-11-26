# 🔒 Checklist de Segurança - GitHub

## ✅ SEGURO PARA COMMIT

### Arquivos Protegidos (NÃO vão para o GitHub)
- ✅ `.env` - Bloqueado pelo .gitignore
- ✅ `.env.local` - Bloqueado pelo .gitignore
- ✅ `node_modules/` - Bloqueado
- ✅ `.next/` - Bloqueado

### Arquivos SEGUROS para commit
- ✅ `env.example` - Apenas template, sem dados reais
- ✅ `supabase/schema.sql` - Apenas estrutura do banco
- ✅ `supabase/seed.sql` - Dados de EXEMPLO (não são reais)
- ✅ `supabase/storage-policies.sql` - Apenas políticas
- ✅ Todo código em `src/` - Sem credenciais

---

## ⚠️ ATENÇÃO: Verificar ANTES de commitar

### 1. Arquivo `supabase/seed.sql`
**PROBLEMA:** Contém UUID e email reais do usuário de teste

**SOLUÇÃO:** Substitua por dados genéricos antes do commit:

```sql
-- ANTES (com dados reais)
INSERT INTO public.profiles (id, email, name)
VALUES (
  '6b146d86-f207-43f9-a9c2-02f20dfa98a5'::uuid,  ← UUID real
  'teste@maoamiga.com',  ← Email real
  'Usuário Teste'
)

-- DEPOIS (com placeholder)
INSERT INTO public.profiles (id, email, name)
VALUES (
  'SEU-USER-ID-AQUI'::uuid,  ← Placeholder
  'seu-email@exemplo.com',  ← Email genérico
  'Nome do Usuário'
)
```

---

## 🔐 Dados Sensíveis que NÃO DEVEM ir para GitHub

### ❌ NUNCA commitar:
- Chaves de API reais
- Senhas
- Tokens de autenticação
- Service Role Key do Supabase
- UUIDs de usuários reais
- Emails pessoais
- Chaves Pix reais
- Dados de produção

### ✅ PODE commitar:
- Código fonte
- Componentes React
- Schemas SQL (estrutura)
- Dados de exemplo fictícios
- Documentação
- Configurações públicas

---

## 📝 Comandos para verificar antes do commit

```bash
# Ver o que será commitado
git status

# Ver diferenças
git diff

# Verificar se .env está ignorado
git check-ignore .env
# Deve retornar: .env (se estiver protegido)

# Ver conteúdo do .gitignore
cat .gitignore
```

---

## ✅ Checklist Final

Antes de fazer `git push`:

- [ ] `.env` está no `.gitignore`? ✅ SIM
- [ ] `env.example` não tem dados reais? ✅ SIM
- [ ] `seed.sql` tem apenas dados de exemplo? ⚠️ VERIFICAR
- [ ] Não há senhas no código? ✅ SIM
- [ ] Não há tokens no código? ✅ SIM
- [ ] README.md está atualizado? ✅ SIM

---

## 🚀 Comandos Seguros para Git

```bash
# Inicializar repositório
git init

# Adicionar todos os arquivos (exceto os do .gitignore)
git add .

# Verificar o que será commitado
git status

# Fazer commit
git commit -m "feat: initial commit - Mão Amiga platform"

# Adicionar remote
git remote add origin https://github.com/seu-usuario/mao-amiga.git

# Push
git push -u origin main
```

---

## 🔧 Se acidentalmente commitou dados sensíveis

### Remover do histórico:
```bash
# Remover arquivo do Git mas manter localmente
git rm --cached .env

# Commit da remoção
git commit -m "Remove sensitive files"

# Force push (CUIDADO!)
git push --force
```

### Invalidar credenciais expostas:
1. Gerar novas chaves no Supabase
2. Atualizar `.env.local`
3. Nunca reusar chaves expostas

---

## 📚 Boas Práticas

1. **Sempre revisar antes de commitar:**
   ```bash
   git diff --staged
   ```

2. **Usar branches:**
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```

3. **Commits pequenos e descritivos:**
   ```bash
   git commit -m "feat: add campaign creation form"
   git commit -m "fix: correct Pix QR code generation"
   ```

4. **Nunca commitar:**
   - Arquivos `.env*` (exceto `.env.example`)
   - `node_modules/`
   - Builds (`.next/`, `out/`)
   - Logs

---

## ✅ Resumo: ESTÁ SEGURO?

**SIM**, desde que:
1. ✅ Não edite o `.gitignore` (já está correto)
2. ⚠️ Substitua dados reais em `seed.sql` por placeholders
3. ✅ Não adicione manualmente arquivos `.env`

**Seu projeto está 95% pronto para GitHub!**

Apenas ajuste o `seed.sql` e pode commitar com segurança! 🎉
