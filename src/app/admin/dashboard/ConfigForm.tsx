"use client";

import { useState } from 'react';
import { updateConfig } from './actions';

export default function ConfigForm({ config }: { config: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Converter UTC para horário de Brasília manualmente
  let formattedDate = "2026-06-05T00:00";
  if (config?.unlock_date) {
    try {
      const d = new Date(config.unlock_date);
      d.setUTCHours(d.getUTCHours() - 3);
      formattedDate = d.toISOString().slice(0, 16);
    } catch (e) {
      formattedDate = "2026-06-05T00:00";
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const formData = new FormData(e.currentTarget);
    const result = await updateConfig(formData);
    
    setLoading(false);
    
    if (result?.error) {
      setMessage(`Erro: ${result.error}`);
    } else if (result?.success) {
      setMessage('Salvo com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
      <input type="hidden" name="id" value={config?.id || ''} />
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Links do Spotify (Cole um link por linha para adicionar múltiplas playlists)</label>
        <textarea 
          name="spotify_url"
          defaultValue={config?.spotify_url || ''}
          placeholder="https://open.spotify.com/playlist/...\nhttps://open.spotify.com/track/..." 
          rows={3}
          style={{ width: '100%', padding: '0.5rem', background: '#0f141e', color: 'white', border: '1px solid #333', resize: 'vertical' }} 
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Data do Aniversário</label>
        <input 
          type="datetime-local" 
          name="unlock_date"
          defaultValue={formattedDate}
          style={{ width: '100%', padding: '0.5rem', background: '#0f141e', color: 'white', border: '1px solid #333' }} 
        />
      </div>
      
      <button disabled={loading} style={{ background: 'var(--color-her-pink)', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '4px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Salvando...' : 'Salvar Configurações'}
      </button>

      {message && <p style={{ color: message.includes('Erro') ? '#ff4757' : '#10ac84', marginTop: '0.5rem' }}>{message}</p>}
    </form>
  );
}
