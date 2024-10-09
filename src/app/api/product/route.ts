import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const colors = req.nextUrl.searchParams.getAll('color[]');
  const sizes = req.nextUrl.searchParams.getAll('size[]');
  const startPrice = parseFloat(
    req.nextUrl.searchParams.get('price[range][0]') || '0'
  );
  const endPrice = parseFloat(
    req.nextUrl.searchParams.get('price[range][1]') || 'Infinity'
  );
  const query = req.nextUrl.searchParams.get('query') || ''; // Default to empty string if query is not provided

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

        price: {
          gte: startPrice, // Greater than or equal to startPrice
          lte: endPrice, // Less than or equal to endPrice
        },

        ...(query && {
          name: {
            contains: query, // Filters by product name containing the query string
            mode: 'insensitive', // Case-insensitive search
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
