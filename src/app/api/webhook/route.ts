import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log('Received event type:', event.type);
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

  if (event.type === 'checkout.session.completed') {
    console.log('Charge succeeded event received');
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
  }

  return new NextResponse(null, { status: 200 });
}