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

  let isoString;
  try {
    const [datePart, timePart] = unlock_date.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    
    // Create date in UTC assuming the input was already UTC, then add 3 hours to compensate for Brazil time
    const d = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)));
    d.setUTCHours(d.getUTCHours() + 3);
    isoString = d.toISOString();
  } catch (e) {
    isoString = new Date().toISOString();
  }

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
