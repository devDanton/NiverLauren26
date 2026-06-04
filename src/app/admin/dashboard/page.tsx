import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_auth');

  if (isAdmin?.value !== 'true') {
    redirect('/admin');
  }

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
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Link do Spotify (Playlist)</label>
              <input type="text" placeholder="https://open.spotify.com/playlist/..." style={{ width: '100%', padding: '0.5rem', background: '#0f141e', color: 'white', border: '1px solid #333' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Data do Aniversário</label>
              <input type="datetime-local" defaultValue="2026-06-05T00:00" style={{ width: '100%', padding: '0.5rem', background: '#0f141e', color: 'white', border: '1px solid #333' }} />
            </div>
            <button style={{ background: 'var(--color-her-pink)', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '4px', cursor: 'pointer' }}>Salvar Configurações</button>
          </form>
        </div>

        <div style={{ flex: '2', minWidth: '300px', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px' }}>
          <h2>Gerenciador de Fotos</h2>
          <div style={{ marginTop: '1rem', border: '2px dashed var(--color-her-pink)', padding: '2rem', textAlign: 'center', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255, 107, 129, 0.05)' }}>
            <p>Arraste fotos aqui ou clique para fazer upload</p>
            <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>(O upload será conectado ao Supabase Storage)</p>
          </div>
        </div>
      </section>
    </div>
  );
}
