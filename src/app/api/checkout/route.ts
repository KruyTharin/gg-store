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
  const { items } = await req.json();

  const productIds = items.map((item: any) => item.id);

  if (!productIds || productIds.length === 0) {
    return new NextResponse('Product not found', {
      status: 400,
    });
  }

  const session = await auth();

  if (!session) {
    return new NextResponse('unAuthorize!', {
      status: 401,
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
    const quantity = items.find((i: any) => i.id === product.id)?.quantity || 1;

    line_items.push({
      quantity: quantity,
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
          quantity: items.find((i: any) => i.id === productId)?.quantity || 1,
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
    success_url: `${process.env.SUCCESS_PAYMENT_URL}/payment-success`,
    cancel_url: `${process.env.SUCCESS_PAYMENT_URL}/payment-failed`,
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
