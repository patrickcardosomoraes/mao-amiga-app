-- Script completo para popular o banco com dados de teste
-- Execute isso no SQL Editor do Supabase após criar o schema

-- PASSO 1: Criar perfil do usuário na tabela profiles
-- IMPORTANTE: Substitua com os dados do seu usuário criado em Authentication > Users

INSERT INTO public.profiles (id, email, name)
VALUES (
  'SEU-USER-ID-AQUI'::uuid,  -- Substitua pelo UUID do seu usuário
  'seu-email@exemplo.com',    -- Substitua pelo email do seu usuário
  'Nome do Usuário'           -- Nome opcional
)
ON CONFLICT (id) DO NOTHING;  -- Ignora se já existir

-- PASSO 2: Inserir campanhas de teste

INSERT INTO public.campaigns (
  creator_id,
  title,
  description,
  image_url,
  goal,
  raised,
  pix_key,
  beneficiary_name,
  status
) VALUES
(
  'SEU-USER-ID-AQUI'::uuid,
  'Reconstrução da Casa da Dona Maria',
  'Ajude a Dona Maria a reconstruir sua casa que foi afetada pelas chuvas. Precisamos de material de construção e mão de obra.',
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000&auto=format&fit=crop',
  15000.00,
  8750.00,
  'maria.silva@email.com',
  'Maria da Silva',
  'active'
),
(
  'SEU-USER-ID-AQUI'::uuid,
  'Cirurgia de Emergência do Rex',
  'O Rex precisa de uma cirurgia urgente na pata. Ele foi resgatado e agora precisa da nossa ajuda para voltar a correr.',
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000&auto=format&fit=crop',
  3000.00,
  1200.00,
  '12345678900',
  'Abrigo Animal',
  'active'
),
(
  'SEU-USER-ID-AQUI'::uuid,
  'Horta Comunitária do Bairro',
  'Vamos criar uma horta para alimentar 50 famílias carentes. O valor será usado para sementes, ferramentas e adubo.',
  'https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=1000&auto=format&fit=crop',
  5000.00,
  4800.00,
  'horta@comunidade.org',
  'Associação de Moradores',
  'active'
);

-- PASSO 3: Inserir apoiadores de exemplo

INSERT INTO public.supporters (campaign_id, name, amount, message)
SELECT 
  id,
  'João Pedro',
  100.00,
  'Força Dona Maria!'
FROM public.campaigns
WHERE title = 'Reconstrução da Casa da Dona Maria'
LIMIT 1;

INSERT INTO public.supporters (campaign_id, name, amount, message)
SELECT 
  id,
  'Ana Clara',
  50.00,
  'Deus abençoe'
FROM public.campaigns
WHERE title = 'Reconstrução da Casa da Dona Maria'
LIMIT 1;

INSERT INTO public.supporters (campaign_id, name, amount, message)
SELECT 
  id,
  'Marcos Silva',
  200.00,
  'Que Deus multiplique!'
FROM public.campaigns
WHERE title = 'Cirurgia de Emergência do Rex'
LIMIT 1;
