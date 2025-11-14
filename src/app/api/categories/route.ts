import { authOptions } from '@/lib/auth';
import { getUserByEmail } from '@/app/controllers/userController';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import {
  createCategory,
  getAllCategories,
  getCategory,
} from '@/app/controllers/categoryController';
import { Category } from '@prisma/client';

export const POST = async (req: Request) => {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json({ message: 'Method not allowed', status: 405 }, { status: 405 });
    }
    // ✅ Parse the body (req.body doesn’t exist in App Router)
    const body: Category = await req.json();
    const { name, type } = body;

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
    const categoryFromDB = await getCategory(name);
    if (categoryFromDB) {
      return NextResponse.json(
        {
          message: 'Category with the same name already exists',
        },
        { status: 400 },
      );
    }

    const account = await createCategory(
      {
        name,
        type,
      },
      user.id,
    ); // ✅ use ID internally only here

    return NextResponse.json(
      { message: 'Category created successfully', data: account, status: 201 },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating category:', error);
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

    const categories = await getAllCategories(user.id);

    return NextResponse.json(
      { message: 'All accounts fetched successfully', data: categories, status: 201 },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ message: 'Internal server error', status: 500 }, { status: 500 });
  }
};
