-- Adiciona a coluna para armazenar a URL do comprovante na tabela de apoiadores
ALTER TABLE public.supporters 
ADD COLUMN IF NOT EXISTS proof_url TEXT;
