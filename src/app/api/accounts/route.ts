import { createAccount, getAccount, getAllAccounts } from '@/app/controllers/accountController';
import { getUserByEmail } from '@/app/controllers/userController';
import { authOptions } from '@/lib/auth';
import { Account } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json({ message: 'Method not allowed', status: 405 }, { status: 405 });
    }
    // ✅ Parse the body (req.body doesn’t exist in App Router)
    const body: Account = await req.json();
    const { name, type, balance, currency } = body;

    // ✅ get user from session (token-based)
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // ✅ fetch the user from DB based on email (since we removed id)
    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (!name || !type) {
      return NextResponse.json(
        { message: 'Missing required fields', status: 400 },
        { status: 400 },
      );
    }

    // ✅ check if account with same name exist, if so dont create a new one and throw error for this
    const accountFromDB = await getAccount(name);
    if (accountFromDB) {
      return NextResponse.json(
        {
          message: 'Account with the same name already exists',
        },
        { status: 400 },
      );
    }

    const account = await createAccount(
      {
        name,
        type,
        balance: balance ? Number(balance) : 0,
        currency: currency || 'INR',
      },
      user.id,
    ); // ✅ use ID internally only here

    return NextResponse.json(
      { message: 'Account created successfully', data: account, status: 201 },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json({ message: 'Internal server error', status: 500 }, { status: 500 });
  }
};

export const GET = async (req: Request) => {
  try {
    if (req.method !== 'GET') {
      return NextResponse.json({ message: 'Method not allowed', status: 405 }, { status: 405 });
    }

    // ✅ get logged-in user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    // ✅ look up the user from DB
    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const accounts = await getAllAccounts(user.id);

    return NextResponse.json(
      { message: 'All accounts fetched successfully', data: accounts, status: 201 },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ message: 'Internal server error', status: 500 }, { status: 500 });
  }
};
