import { supabase } from '@/lib/supabase';
import ClientHome from '@/components/ClientHome';

export const revalidate = 0; // Desativa cache pesado para que as alterações no Admin reflitam na hora

export default async function Home() {
  const { data: config } = await supabase
    .from('config')
    .select('unlock_date, spotify_url')
    .limit(1)
    .single();

  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: letters } = await supabase
    .from('letters')
    .select('*')
    .order('created_at', { ascending: true });

  const targetDateStr = config?.unlock_date || "2026-06-05T00:00:00Z";
  const spotifyUrl = config?.spotify_url || "";

  return <ClientHome targetDateStr={targetDateStr} spotifyUrl={spotifyUrl} photos={photos || []} letters={letters || []} />;
}
