"use server";

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function updateConfig(formData: FormData) {
  const id = formData.get('id') as string;
  const spotify_url = formData.get('spotify_url') as string;
  const unlock_date = formData.get('unlock_date') as string;

  if (!id || !spotify_url || !unlock_date) {
    return { error: 'Campos obrigatórios faltando' };
  }

  const dateObj = new Date(unlock_date);
  const isoString = dateObj.toISOString();

  const { error } = await supabase
    .from('config')
    .update({
      spotify_url,
      unlock_date: isoString,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating config:', error);
    return { error: 'Erro ao salvar configurações' };
  }

  revalidatePath('/');
  revalidatePath('/admin/dashboard');

  return { success: true };
}
