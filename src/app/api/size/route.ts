import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const sizes = await db.size.findMany({});

    return NextResponse.json(sizes, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json('Fetch error', {
      status: 500,
    });
  }
}
