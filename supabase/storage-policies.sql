-- Políticas de Storage para Mão Amiga
-- Execute este script no SQL Editor do Supabase

-- ============================================
-- BUCKET: campaign-images
-- ============================================

-- Política de Leitura Pública
CREATE POLICY "Public Access - campaign-images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'campaign-images' );

-- Política de Upload Autenticado
CREATE POLICY "Authenticated Upload - campaign-images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'campaign-images' 
  AND auth.role() = 'authenticated'
);

-- Política de Atualização (para o dono do arquivo)
CREATE POLICY "Owner Update - campaign-images"
ON storage.objects FOR UPDATE
USING ( 
  bucket_id = 'campaign-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'campaign-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política de Deleção (para o dono do arquivo)
CREATE POLICY "Owner Delete - campaign-images"
ON storage.objects FOR DELETE
USING ( 
  bucket_id = 'campaign-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- BUCKET: avatars
-- ============================================

-- Política de Leitura Pública
CREATE POLICY "Public Access - avatars"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Política de Upload Autenticado
CREATE POLICY "Authenticated Upload - avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);

-- Política de Atualização (para o dono do arquivo)
CREATE POLICY "Owner Update - avatars"
ON storage.objects FOR UPDATE
USING ( 
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política de Deleção (para o dono do arquivo)
CREATE POLICY "Owner Delete - avatars"
ON storage.objects FOR DELETE
USING ( 
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
