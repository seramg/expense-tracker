import { createAccount, getAllAccounts } from '@/app/controllers/accountController';
import { Account } from '@/generated/prisma';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json({ message: 'Method not allowed', status: 405 }, { status: 405 });
    }
    // ✅ Parse the body (req.body doesn’t exist in App Router)
    const body: Account = await req.json();
    const { name, type, balance, currency, userId } = body;

    if (!name || !type || !userId) {
      return NextResponse.json(
        { message: 'Missing required fields', status: 400 },
        { status: 400 },
      );
    }

    const account = await createAccount({
      name,
      type,
      balance: balance ? Number(balance) : 0,
      currency: currency || 'INR',
      user: { connect: { id: userId } },
    });

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
    // ✅ Parse the searchParams to get user id
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ message: 'userId is required' }, { status: 400 });
    }

    const accounts = await getAllAccounts(userId);

    return NextResponse.json(
      { message: 'All accounts fetched successfully', data: accounts, status: 201 },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ message: 'Internal server error', status: 500 }, { status: 500 });
  }
};
