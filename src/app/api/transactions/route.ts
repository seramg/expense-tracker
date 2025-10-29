import { createTransaction } from '@/app/controllers/transactionController';
import { Transaction } from '@/generated/prisma';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json({ message: 'Method not allowed', status: 405 }, { status: 405 });
    }
    // ✅ Parse the body (req.body doesn’t exist in App Router)
    const body: Transaction = await req.json();
    const { merchant, amount, date, type, userId, categoryId, fromAccountId, toAccountId } = body;

    if (!merchant || !amount || !date || !type || !categoryId || !userId) {
      return NextResponse.json(
        { message: 'Missing required fields', status: 400 },
        { status: 400 },
      );
    }

    const transaction = await createTransaction({
      merchant,
      amount: parseFloat(amount.toString()),
      date: new Date(date),
      type,
      user: { connect: { id: userId } },
      category: { connect: { id: categoryId } },
      ...(fromAccountId && { fromAccount: { connect: { id: fromAccountId } } }),
      ...(toAccountId && { toAccount: { connect: { id: toAccountId } } }),
    });

    return NextResponse.json(
      { message: 'Transaction created successfully', data: transaction },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ message: 'Internal server error', status: 500 }, { status: 500 });
  }
};
