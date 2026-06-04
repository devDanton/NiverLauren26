import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ConfigForm from './ConfigForm';
import PhotoManager from './PhotoManager';
import LetterManager from './LetterManager';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_auth');

  if (isAdmin?.value !== 'true') {
    redirect('/admin');
  }

  // Fetch config
  const { data: configData } = await supabase
    .from('config')
    .select('*')
    .limit(1)
    .single();

  // Fetch photos
  const { data: photosData } = await supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false });

  // Fetch letters
  const { data: lettersData } = await supabase
    .from('letters')
    .select('*')
    .order('created_at', { ascending: true });

  return (
    <div style={{ padding: '2rem', color: 'white', minHeight: '100vh', background: 'var(--color-background)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
        <h1 style={{ fontFamily: 'var(--font-vintage)', color: 'var(--color-her-pink)' }}>Painel Administrativo</h1>
        <form action={async () => {
          "use server";
          const cookieStore = await cookies();
          cookieStore.delete('admin_auth');
          redirect('/admin');
        }}>
          <button style={{ background: 'transparent', color: 'white', border: '1px solid white', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
        </form>
      </header>

      <section style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px' }}>
          <h2>Configurações Gerais</h2>
          <ConfigForm config={configData} />
        </div>

        <div style={{ flex: '2', minWidth: '300px', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px' }}>
          <h2>Gerenciador de Fotos</h2>
          <PhotoManager photos={photosData || []} />
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px' }}>
          <h2>Cartas Surpresa</h2>
          <p style={{ marginBottom: '1rem', opacity: 0.8 }}>Escreva mensagens de familiares, amigos e do amor da vida dela. Cada carta terá um envelope fechado com uma animação especial na tela pública.</p>
          <LetterManager letters={lettersData || []} />
        </div>
      </section>
    </div>
  );
}
