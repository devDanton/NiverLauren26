-- Criação da tabela de configurações
CREATE TABLE IF NOT EXISTS public.config (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  spotify_url text DEFAULT 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ',
  unlock_date timestamp with time zone DEFAULT '2026-06-05T00:00:00Z',
  welcome_text text DEFAULT 'Bem-vinda à sua exposição de arte particular.',
  updated_at timestamp with time zone DEFAULT now()
);

-- Inserir uma linha padrão se a tabela estiver vazia
INSERT INTO public.config (spotify_url)
SELECT 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ'
WHERE NOT EXISTS (SELECT 1 FROM public.config);

-- Criação da tabela de fotos
CREATE TABLE IF NOT EXISTS public.photos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  url text NOT NULL,
  category text DEFAULT 'Sem Categoria',
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS (Row Level Security) para segurança (Permitir leitura pública e escrita apenas autenticada, mas como é um app simples, podemos permitir tudo anonimamente para a leitura)
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para a tabela Config (Leitura e Escrita pública para facilitar nosso Admin via Server Actions)
CREATE POLICY "Enable read access for all users" ON public.config FOR SELECT USING (true);
CREATE POLICY "Enable all access for all users" ON public.config FOR ALL USING (true);

-- Políticas de acesso para a tabela Photos
CREATE POLICY "Enable read access for all users" ON public.photos FOR SELECT USING (true);
CREATE POLICY "Enable all access for all users" ON public.photos FOR ALL USING (true);

-- Lembrete: Você também precisará criar um Bucket no Supabase Storage chamado "uploads" e torná-lo Público!
