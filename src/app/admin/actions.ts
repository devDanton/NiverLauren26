"use server";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAdmin(formData: FormData) {
  const password = formData.get('password');
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set('admin_auth', 'true', { httpOnly: true, path: '/' });
    redirect('/admin/dashboard');
  }

  return { error: 'Senha incorreta' };
}
