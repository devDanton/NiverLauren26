-- Execute este script no SQL Editor do Supabase para criar a tabela de Cartas Surpresa

CREATE TABLE public.letters (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_name text NOT NULL,
  relationship text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configuração de RLS (Segurança)
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;

-- Permite leitura pública (para as cartas aparecerem no site)
CREATE POLICY "Cartas são públicas para leitura" 
ON public.letters FOR SELECT 
USING (true);

-- Permite inserção pública (pois o painel usa a anon key)
CREATE POLICY "Permitir inserção de cartas" 
ON public.letters FOR INSERT 
WITH CHECK (true);

-- Permite deletar (pois o painel usa a anon key)
CREATE POLICY "Permitir deletar cartas" 
ON public.letters FOR DELETE 
USING (true);
