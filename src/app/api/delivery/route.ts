import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const users = await db.user.findMany({
      where: {
        role: 'DELIVERY',
      },
    });

    return NextResponse.json(users, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json('Fetch error', {
      status: 500,
    });
  }
}
