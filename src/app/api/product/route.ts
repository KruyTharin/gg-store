import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const colors = req.nextUrl.searchParams.getAll('color[]');
  const sizes = req.nextUrl.searchParams.getAll('size[]');

  try {
    const products = await db.product.findMany({
      include: {
        images: true,
        color: true,
      },
      where: {
        ...(colors.length > 0 && {
          color: {
            value: {
              in: colors,
            },
          },
        }),

        ...(sizes.length > 0 && {
          size: {
            value: {
              in: sizes,
            },
          },
        }),
      },
    });

    return NextResponse.json(products, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json('Fetch error', {
      status: 500,
    });
  }
}
