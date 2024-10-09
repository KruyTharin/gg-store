import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const color = await db.color.findMany({});

    return NextResponse.json(color, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json('Fetch error', {
      status: 500,
    });
  }
}
