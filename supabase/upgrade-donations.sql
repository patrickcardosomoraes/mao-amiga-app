-- 1. ADICIONAR COLUNA DONOR_ID
-- Permite saber quem fez a doação (pode ser nulo se for anônimo/deslogado)
ALTER TABLE public.supporters 
ADD COLUMN IF NOT EXISTS donor_id UUID REFERENCES auth.users(id);

-- 2. CORREÇÃO DE STATUS E VALORES (O mesmo do script anterior, para garantir)
UPDATE public.campaigns SET status = 'active' WHERE status IS NULL OR status = '';

-- Recalcula o total arrecadado de todas as campanhas
UPDATE public.campaigns c
SET raised = (
    SELECT COALESCE(SUM(amount), 0)
    FROM public.supporters s
    WHERE s.campaign_id = c.id
);

-- 3. ATUALIZAR TRIGGER (Para garantir que funcione)
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

DROP TRIGGER IF EXISTS update_raised_on_support ON public.supporters;
CREATE TRIGGER update_raised_on_support
  AFTER INSERT OR UPDATE OR DELETE ON public.supporters
  FOR EACH ROW EXECUTE PROCEDURE update_campaign_raised();

-- 4. PERMISSÕES
ALTER TABLE public.supporters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can add support" ON public.supporters;
CREATE POLICY "Anyone can add support" ON public.supporters FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Supporters are viewable by everyone" ON public.supporters;
CREATE POLICY "Supporters are viewable by everyone" ON public.supporters FOR SELECT USING (true);
