import Stripe from 'stripe';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET_KEY!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error:  ${error.message}`, {
      status: 400,
    });
  }
  const session = event.data.object as Stripe.Checkout.Session;
  const address = session.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.country,
    address?.postal_code,
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(', ');

  console.log('call======================>');

  if (event.type === 'checkout.session.completed') {
    const order = await db.order.update({
      where: {
        id: session?.metadata?.orderId,
      },

      data: {
        isPaid: true,
        address: addressString,
        phoneNumber: session.customer_details?.phone || '',
      },
      include: {
        orderItem: true,
      },
    });

    const productIds = order.orderItem.map((order) => order.productId);

    await db.product.updateMany({
      where: {
        id: {
          in: productIds,
        },
      },
      data: {
        isArchived: true,
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
