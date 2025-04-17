import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/app/lib/prisma';

export async function POST(request: Request) {
  try {
    const { username, email, password, fullName } = await request.json();

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: email || undefined },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this username or email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        fullName,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: 'User registered successfully', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
} 