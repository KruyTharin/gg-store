import Stripe from 'stripe';

import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/auth';

const coresHeader = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT,DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: coresHeader });
}

export async function POST(req: Request) {
  const { productIds } = await req.json();

  console.log(productIds, 'productIds');

  const session = await auth();

  if (!session) {
    return new NextResponse('unAuthorize!', {
      status: 401,
    });
  }

  if (!productIds || productIds.length === 0) {
    return new NextResponse('Product not found', {
      status: 400,
    });
  }

  const products = await db.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'USD',
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber() * 100,
      },
    });
  });

  const order = await db.order.create({
    data: {
      isPaid: false,
      userId: session.user.id,
      orderItem: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });

  const stripeSession = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    billing_address_collection: 'required',
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.SUCCESS_PAYMENT_URL}/card?success=1`,
    cancel_url: `${process.env.SUCCESS_PAYMENT_URL}/card?cancelled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json(
    {
      url: stripeSession.url,
    },
    {
      headers: coresHeader,
    }
  );
}
