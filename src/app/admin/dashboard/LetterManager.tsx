"use client";

import { useState } from 'react';
import { createLetterAction, deleteLetterAction } from './LetterActions';

export default function LetterManager({ letters }: { letters: any[] }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const result = await createLetterAction(formData);

    setLoading(false);

    if (result.error) {
      setMessage(`Erro: ${result.error}`);
    } else {
      setMessage('Carta criada com sucesso!');
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta carta?')) {
      await deleteLetterAction(id);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Remetente (Quem enviou)</label>
            <input name="sender_name" required placeholder="Ex: Danton" style={{ width: '100%', padding: '0.5rem', background: '#0f141e', color: 'white', border: '1px solid #333' }} />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Grau de Parentesco</label>
            <select name="relationship" required style={{ width: '100%', padding: '0.5rem', background: '#0f141e', color: 'white', border: '1px solid #333' }}>
              <option value="esposo">Esposo (Amor da Vida)</option>
              <option value="pais">Pai / Mãe</option>
              <option value="irmaos">Irmão / Irmã</option>
              <option value="avos">Avô / Avó</option>
              <option value="amigos">Amigos / Outros</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Mensagem da Carta</label>
          <textarea name="content" required rows={5} placeholder="Escreva a mensagem aqui..." style={{ width: '100%', padding: '0.5rem', background: '#0f141e', color: 'white', border: '1px solid #333', resize: 'vertical' }} />
        </div>

        <button disabled={loading} style={{ background: 'var(--color-her-pink)', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '4px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Salvando...' : 'Adicionar Carta'}
        </button>
      </form>

      {message && <p style={{ marginTop: '1rem', color: message.includes('Erro') ? '#ff4757' : '#10ac84' }}>{message}</p>}

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem' }}>Cartas Adicionadas ({letters?.length || 0})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {letters && letters.map((letter) => (
            <div key={letter.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid #333', position: 'relative' }}>
              <h4 style={{ color: 'var(--color-her-pink)', marginBottom: '0.5rem' }}>{letter.sender_name} <span style={{ fontSize: '0.8rem', color: '#888' }}>({letter.relationship})</span></h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.8, whiteSpace: 'pre-wrap' }}>{letter.content.length > 100 ? letter.content.substring(0, 100) + '...' : letter.content}</p>
              <button 
                onClick={() => handleDelete(letter.id)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '12px' }}
              >
                Deletar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
