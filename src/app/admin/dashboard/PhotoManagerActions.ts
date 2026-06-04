"use server";

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function uploadPhotoAction(formData: FormData) {
  const file = formData.get('file') as File;
  const originalSize = formData.get('originalSize') as string;
  const originalName = formData.get('originalName') as string;

  if (!file) return { error: 'Nenhum arquivo enviado.' };

  // Format: timestamp__size__name
  const safeName = (originalName || file.name).replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const size = originalSize || file.size.toString();
  const fileName = `${Date.now()}__${size}__${safeName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(fileName, file, {
      upsert: false
    });

  if (uploadError) {
    console.error('Upload Error:', uploadError);
    return { error: `Upload falhou: ${uploadError.message}` };
  }

  const { data: publicUrlData } = supabase.storage
    .from('uploads')
    .getPublicUrl(fileName);

  const { error: dbError } = await supabase
    .from('photos')
    .insert({ url: publicUrlData.publicUrl });

  if (dbError) {
    console.error('DB Error:', dbError);
    return { error: 'Upload concluído mas falhou ao salvar no BD.' };
  }

  revalidatePath('/');
  revalidatePath('/admin/dashboard');

  return { success: true };
}

export async function deletePhotoAction(id: string) {
  const { error } = await supabase.from('photos').delete().eq('id', id);
  if (error) {
    console.error('Delete Error:', error);
    return { error: 'Erro ao deletar foto' };
  }
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function deleteAllPhotosAction() {
  // Delete all rows by using a condition that is always true
  const { error } = await supabase.from('photos').delete().neq('url', 'IMPOSSIBLE_URL_THAT_DOESNT_EXIST');
  
  if (error) {
    console.error('Delete All Error:', error);
    return { error: 'Erro ao deletar todas as fotos' };
  }
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { success: true };
}
