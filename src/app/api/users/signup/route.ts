import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail } from '@/app/controllers/userController';
import { mapUser } from '@/app/utils/user';

export const POST = async (req: Request) => {
  try {
    // ✅ Method safety check (optional, but explicit)
    if (req.method !== 'POST') {
      return NextResponse.json({ message: 'Method not allowed', status: 405 }, { status: 405 });
    }

    // ✅ Parse the body (req.body doesn’t exist in App Router)
    const body = await req.json();
    const { name, email, password, ...restData } = body;

    // ✅ Validate fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Missing required fields', status: 400, data: null },
        { status: 400 },
      );
    }

    // ✅ Connect DB
    await connectDB();

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      if (existingUser.provider === 'credentials') {
        return NextResponse.json(
          {
            message: 'User already exists. Please sign in with email/password.',
            status: 409,
            data: null,
          },
          { status: 409 },
        );
      } else {
        return NextResponse.json(
          {
            message: `User already registered via ${existingUser.provider}. Please sign in using ${existingUser.provider}.`,
            status: 409,
            data: null,
          },
          { status: 409 },
        );
      }
    }

    // ✅ Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
      provider: 'credentials',
      ...restData,
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        status: 201,
        data: mapUser(newUser),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', status: 500, data: null },
      { status: 500 },
    );
  }
};

// ✅ Optional: Gracefully handle GET requests
export async function GET() {
  return NextResponse.json({ message: 'Method not allowed', status: 405 }, { status: 405 });
}
