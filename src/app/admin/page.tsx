import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_auth');

  if (isAdmin?.value === 'true') {
    redirect('/admin/dashboard');
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-background)' }}>
      <LoginForm />
    </div>
  );
}
