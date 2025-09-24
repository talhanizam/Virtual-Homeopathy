import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServiceRoleClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
	const rawBody = await req.text();
	const signature = req.headers.get('x-razorpay-signature') || '';
	const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || '';
	const digest = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
	if (digest !== signature) {
		return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
	}

	const event = JSON.parse(rawBody);
	const payment = event?.payload?.payment?.entity;
	const orderId = payment?.order_id as string | undefined;
	const status = payment?.status as string | undefined;
	const paymentId = payment?.id as string | undefined;
	const rzpSignature = payment?.signature as string | undefined;

	if (!orderId) return NextResponse.json({ ok: true });

	const supa = createServiceRoleClient();
	// Find our internal order by razorpay_order_id
	const { data: orderRow } = await supa
		.from('orders')
		.select('id, user_id, ebook_id, status')
		.eq('razorpay_order_id', orderId)
		.single();

	if (!orderRow) {
		await supa.from('payments').insert({ order_id: orderId, status, payload: event });
		return NextResponse.json({ ok: true });
	}

	// Update order with payment details
	await supa
		.from('orders')
		.update({
			razorpay_payment_id: paymentId || null,
			razorpay_signature: rzpSignature || null,
			status: status === 'captured' ? 'paid' : orderRow.status,
		})
		.eq('id', orderRow.id);

	if (status === 'captured') {
		// Grant purchase
		await supa
			.from('purchases')
			.upsert({ user_id: orderRow.user_id, ebook_id: orderRow.ebook_id, order_id: orderRow.id }, { onConflict: 'user_id,ebook_id' as any });
	}

	await supa.from('payments').insert({ order_id: orderId, status, payload: event });
	return NextResponse.json({ ok: true });
}
