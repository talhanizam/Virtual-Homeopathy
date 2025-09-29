import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServiceRoleClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment verification fields' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET as string;
    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    const supa = await createServiceRoleClient();
    const { data: orderRow, error: orderErr } = await supa
      .from('orders')
      .select('id, user_id, ebook_id, status')
      .eq('razorpay_order_id', razorpay_order_id)
      .single();
    if (orderErr || !orderRow) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    await supa
      .from('orders')
      .update({ status: 'paid', razorpay_payment_id, razorpay_signature })
      .eq('id', orderRow.id);

    await supa
      .from('purchases')
      .upsert({ user_id: orderRow.user_id, ebook_id: orderRow.ebook_id, order_id: orderRow.id }, { onConflict: 'user_id,ebook_id' as any });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}


