-- 1. CORREÇÃO DE STATUS
-- Força todas as campanhas a terem status 'active' para aparecerem no dashboard
UPDATE public.campaigns SET status = 'active' WHERE status IS NULL OR status = '';

-- 2. CORREÇÃO DE PERMISSÕES (POLICIES)
-- Remove policies antigas para evitar conflitos e bloqueios
DROP POLICY IF EXISTS "Campaigns are viewable by everyone" ON public.campaigns;
DROP POLICY IF EXISTS "Authenticated users can create campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Anyone can add support" ON public.supporters;
DROP POLICY IF EXISTS "Supporters are viewable by everyone" ON public.supporters;

-- Cria policies permissivas (Garante que tudo funcione)
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supporters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaigns are viewable by everyone" ON public.campaigns FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create campaigns" ON public.campaigns FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update own campaigns" ON public.campaigns FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Anyone can add support" ON public.supporters FOR INSERT WITH CHECK (true);
CREATE POLICY "Supporters are viewable by everyone" ON public.supporters FOR SELECT USING (true);

-- 3. CORREÇÃO DE VALORES (RECALCULAR TUDO)
-- Função para atualizar o valor arrecadado
CREATE OR REPLACE FUNCTION update_campaign_raised()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.campaigns
  SET raised = (
    SELECT COALESCE(SUM(amount), 0)
    FROM public.supporters
    WHERE campaign_id = NEW.campaign_id
  )
  WHERE id = NEW.campaign_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Garante que o trigger existe
DROP TRIGGER IF EXISTS update_raised_on_support ON public.supporters;
CREATE TRIGGER update_raised_on_support
  AFTER INSERT OR UPDATE OR DELETE ON public.supporters
  FOR EACH ROW EXECUTE PROCEDURE update_campaign_raised();

-- FORÇA A ATUALIZAÇÃO AGORA MESMO
-- Recalcula o campo 'raised' de todas as campanhas baseado nas doações que já existem
UPDATE public.campaigns c
SET raised = (
    SELECT COALESCE(SUM(amount), 0)
    FROM public.supporters s
    WHERE s.campaign_id = c.id
);
