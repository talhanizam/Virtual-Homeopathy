import { NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createServiceRoleClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    let body: any = null;
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const form = await req.text();
      body = Object.fromEntries(new URLSearchParams(form) as any);
    } else {
      // Try json as fallback
      try { body = await req.json(); } catch {}
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body || {};
    if (!razorpay_order_id) {
      return NextResponse.json({ error: 'Missing order id' }, { status: 400 });
    }

    let verified = false;
    const secret = process.env.RAZORPAY_KEY_SECRET as string;
    if (razorpay_payment_id && razorpay_signature) {
      const expected = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
      verified = expected === razorpay_signature;
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY is not set' }, { status: 500 });
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

    // If not verified via signature (e.g., adblockers, new checkout), fall back to server-side verification
    if (!verified) {
      const key_id = process.env.RAZORPAY_KEY_ID as string;
      const key_secret = process.env.RAZORPAY_KEY_SECRET as string;
      const rzp = new Razorpay({ key_id, key_secret });
      try {
        // Fetch payments for this order and confirm at least one is captured
        const result = await (rzp as any).orders.fetchPayments(razorpay_order_id);
        const captured = Array.isArray(result?.items) && result.items.find((p: any) => p.status === 'captured');
        if (captured) {
          verified = true;
        }
      } catch (e: any) {
        // Keep verified=false
      }
    }

    if (!verified) {
      return NextResponse.json({ error: 'Payment not verified' }, { status: 400 });
    }

    const { error: orderUpdateErr } = await supa
      .from('orders')
      .update({ status: 'paid', razorpay_payment_id: razorpay_payment_id || null, razorpay_signature: razorpay_signature || null })
      .eq('id', orderRow.id);
    if (orderUpdateErr) {
      return NextResponse.json({ error: `DB error (orders update): ${orderUpdateErr.message}` }, { status: 500 });
    }

    const { error: purchaseErr } = await supa
      .from('purchases')
      .upsert({ user_id: orderRow.user_id, ebook_id: orderRow.ebook_id, order_id: orderRow.id }, { onConflict: 'user_id,ebook_id' as any });
    if (purchaseErr) {
      return NextResponse.json({ error: `DB error (purchases upsert): ${purchaseErr.message}` }, { status: 500 });
    }

    const { data: purchaseRow } = await supa
      .from('purchases')
      .select('id, user_id, ebook_id, order_id')
      .eq('user_id', orderRow.user_id)
      .eq('ebook_id', orderRow.ebook_id)
      .maybeSingle();

    // If Razorpay triggered a redirect POST, redirect to account
    if (contentType.includes('application/x-www-form-urlencoded')) {
      return NextResponse.redirect(new URL('/account', req.url));
    }

    return NextResponse.json({ ok: true, purchase: purchaseRow || null });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}


