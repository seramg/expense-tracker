import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AccountForm from '@/components/pages/accounts/Form';
import AccountsList from '@/components/pages/accounts/List';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  // Redirect if already logged in
  if (!session) redirect('/dashboard');
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-5 bg-gray-50'>
      <AccountForm />
      <AccountsList />
    </div>
  );
}
