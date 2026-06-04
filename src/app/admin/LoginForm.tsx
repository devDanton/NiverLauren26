"use client";

import { useState } from 'react';
import { loginAdmin } from './actions';

export default function LoginForm() {
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await loginAdmin(formData);
    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#1e272e', padding: '2rem', borderRadius: '8px', textAlign: 'center', color: 'white', minWidth: '300px' }}>
      <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-vintage)', color: 'var(--color-her-pink)' }}>Painel de Controle</h2>
      <input 
        type="password" 
        name="password" 
        placeholder="Senha Mestre" 
        required 
        style={{ padding: '0.8rem', marginBottom: '1rem', width: '100%', borderRadius: '4px', border: '1px solid #ff6b81', background: '#0f141e', color: 'white' }}
      />
      {error && <p style={{ color: '#ff4757', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
      <button type="submit" style={{ background: 'var(--color-her-pink)', color: 'white', padding: '0.8rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>Entrar</button>
    </form>
  );
}
