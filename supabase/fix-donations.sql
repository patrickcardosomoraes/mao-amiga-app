-- 1. Garantir que a tabela supporters tenha RLS habilitado
ALTER TABLE public.supporters ENABLE ROW LEVEL SECURITY;

-- 2. Remover política antiga se existir para evitar conflitos
DROP POLICY IF EXISTS "Anyone can add support (anonymous donations)" ON public.supporters;
DROP POLICY IF EXISTS "Supporters are viewable by everyone" ON public.supporters;

-- 3. Criar política permissiva para INSERÇÃO (Qualquer um pode doar)
CREATE POLICY "Anyone can add support" 
ON public.supporters FOR INSERT 
WITH CHECK (true);

-- 4. Criar política permissiva para LEITURA (Todos podem ver quem doou)
CREATE POLICY "Supporters are viewable by everyone" 
ON public.supporters FOR SELECT 
USING (true);

-- 5. Recriar a função de atualização do valor arrecadado (para garantir que está correta)
CREATE OR REPLACE FUNCTION update_campaign_raised()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualiza o campo 'raised' da campanha somando todas as doações
  UPDATE public.campaigns
  SET raised = (
    SELECT COALESCE(SUM(amount), 0)
    FROM public.supporters
    WHERE campaign_id = NEW.campaign_id
  )
  WHERE id = NEW.campaign_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- SECURITY DEFINER garante que rode com permissões de admin

-- 6. Recriar o Trigger
DROP TRIGGER IF EXISTS update_raised_on_support ON public.supporters;
CREATE TRIGGER update_raised_on_support
  AFTER INSERT OR UPDATE OR DELETE ON public.supporters
  FOR EACH ROW EXECUTE PROCEDURE update_campaign_raised();

-- 7. (Opcional) Forçar uma atualização em todas as campanhas agora para corrigir valores errados
UPDATE public.campaigns c
SET raised = (
    SELECT COALESCE(SUM(amount), 0)
    FROM public.supporters s
    WHERE s.campaign_id = c.id
);
