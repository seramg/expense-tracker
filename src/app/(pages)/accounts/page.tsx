import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AccountsList from '@/components/pages/accounts/List';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  // Redirect if already logged in
  if (!session) redirect('/dashboard');
  return (
    <div className='m-20 min-h-[calc(100vh-10rem)] gap-5 rounded-2xl bg-gray-50 p-10'>
      <AccountsList />
    </div>
  );
}
