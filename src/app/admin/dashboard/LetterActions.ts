"use server";

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function createLetterAction(formData: FormData) {
  const sender_name = formData.get('sender_name') as string;
  const relationship = formData.get('relationship') as string;
  const content = formData.get('content') as string;

  if (!sender_name || !relationship || !content) {
    return { error: 'Preencha todos os campos.' };
  }

  const { error } = await supabase.from('letters').insert({
    sender_name,
    relationship,
    content
  });

  if (error) {
    console.error('Error creating letter:', error);
    return { error: 'Erro ao criar a carta.' };
  }

  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function deleteLetterAction(id: string) {
  const { error } = await supabase.from('letters').delete().eq('id', id);
  
  if (error) {
    console.error('Error deleting letter:', error);
    return { error: 'Erro ao deletar a carta.' };
  }

  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { success: true };
}
