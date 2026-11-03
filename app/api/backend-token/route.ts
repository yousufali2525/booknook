import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { auth } from '@/lib/auth';
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please login first.',
        },
        { status: 401 }
      );
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is missing.');
      return NextResponse.json(
        {
          success: false,
          message: 'Server authentication configuration is missing.',
        },
        { status: 500 }
      );
    }
    const token = jwt.sign(
      {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: 'user',
      },
      secret,
      {
        expiresIn: '1d',
      }
    );
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
    });
  } catch (error) {
    console.error('Backend token generation error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to generate authentication token.',
      },
      { status: 500 }
    );
  }
}