// src/app/dashboard/page.tsx
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { LogoutButton } from '@/components/ui/Button/LogoutBtn';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // User not logged in → redirect to home
    return (
      <div className='flex h-screen items-center justify-center'>
        <p>You must log in to access this page.</p>
      </div>
    );
  }

  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <h1 className='mb-6 text-3xl font-bold'>Welcome to your Dashboard 🎉</h1>
      <LogoutButton />
    </div>
  );
}
