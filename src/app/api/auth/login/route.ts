import { NextResponse } from 'next/server';
import { compare } from 'bcrypt';
import prisma from '@/app/lib/prisma';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'This account has been deactivated' },
        { status: 403 }
      );
    }

    // Verify password
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
} 