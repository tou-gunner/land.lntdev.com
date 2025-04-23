import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { user_name, password } = await request.json();

    try {   
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utility/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_name, password }),
        });

        const data = await response.json();

        if (response.ok) {
            return NextResponse.json(data);
        } else {
            const error = data.message || 'Login failed';
            return NextResponse.json({ success: false, message: error }, { status: response.status });
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}