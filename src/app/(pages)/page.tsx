import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AuthCard from '@/components/pages/auth/AuthCard';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Redirect if already logged in
  if (session) redirect('/dashboard');

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50'>
      <AuthCard />
    </div>
  );
}
