import { createTransaction, getAllTransactions } from '@/app/controllers/transactionController';
import { getUserByEmail } from '@/app/controllers/userController';
import authOptions from '@/lib/auth';
import { Transaction, TransactionType } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json({ message: 'Method not allowed', status: 405 }, { status: 405 });
    }
    // ✅ Parse the body (req.body doesn’t exist in App Router)
    const body: Transaction = await req.json();
    const { merchant, amount, currency, categoryId, fromAccountId, toAccountId, type } = body;

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

    if (!merchant || !amount || !categoryId || !currency || !type) {
      return NextResponse.json(
        { message: 'Missing required fields', status: 400 },
        { status: 400 },
      );
    }

    if (type === TransactionType.credit) {
      if (!toAccountId) {
        return NextResponse.json(
          { message: 'Missing to account field', status: 400 },
          { status: 400 },
        );
      }
    } else if (type === TransactionType.debit) {
      if (!fromAccountId) {
        return NextResponse.json(
          { message: 'Missing from account field', status: 400 },
          { status: 400 },
        );
      }
    } else if (type === TransactionType.transfer) {
      if (!fromAccountId) {
        return NextResponse.json(
          { message: 'Missing from account field', status: 400 },
          { status: 400 },
        );
      }
      if (!toAccountId) {
        return NextResponse.json(
          { message: 'Missing to account field', status: 400 },
          { status: 400 },
        );
      }
    }

    const transaction = await createTransaction(
      {
        merchant,
        amount: parseFloat(amount.toString()),
        type,
        fromAccountId: fromAccountId ?? undefined,
        toAccountId: toAccountId ?? undefined,
        categoryId,
        currency,
      },
      user.id,
    );

    return NextResponse.json(
      { message: 'Transaction created successfully', data: transaction },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ message: 'Internal server error', status: 500 }, { status: 500 });
  }
};

export const GET = async (req: Request) => {
  try {
    if (req.method !== 'GET') {
      return NextResponse.json(
        {
          message: 'Method not allowed',
          status: 405,
        },
        { status: 405 },
      );
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

    const transactions = await getAllTransactions(user.id);

    return NextResponse.json(
      {
        message: 'All Transactions fetched successfully',
        data: transactions,
        status: 201,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      {
        message: 'Internal server error',
        status: 500,
      },
      { status: 500 },
    );
  }
};
