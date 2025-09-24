import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClientServer } from '@/lib/supabase-server';
import { createServiceRoleClient } from '@/lib/supabase-server';

function requireEnv(name: string): string {
	const v = process.env[name];
	if (!v) throw new Error(`Missing env ${name}`);
	return v;
}

const isDev = process.env.NODE_ENV !== 'production';

export async function POST(req: Request) {
	try {
		const { ebook_id } = await req.json();
		if (!ebook_id) return NextResponse.json({ error: 'Missing ebook_id' }, { status: 400 });

		const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
		const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
		const supaSSR = await createClientServer();
		let userId: string | null = null;
		if (bearer) {
			const { data: { user }, error } = await supaSSR.auth.getUser(bearer);
			if (error) return NextResponse.json({ error: `Auth error: ${error.message}` }, { status: 401 });
			userId = user?.id ?? null;
		} else {
			const { data: { user } } = await supaSSR.auth.getUser();
			userId = user?.id ?? null;
		}
		if (!userId) return NextResponse.json({ error: 'Unauthorized: please log in again' }, { status: 401 });

		const service = createServiceRoleClient();
		const { data: ebook, error: ebookErr } = await service
			.from('ebooks')
			.select('id, title, price_inr, is_published')
			.eq('id', ebook_id)
			.single();
		if (ebookErr) return NextResponse.json({ error: `DB error (ebooks): ${ebookErr.message}` }, { status: 500 });
		if (!ebook || !ebook.is_published) return NextResponse.json({ error: 'Ebook not found or unpublished' }, { status: 404 });

		const key_id = requireEnv('RAZORPAY_KEY_ID');
		const key_secret = requireEnv('RAZORPAY_KEY_SECRET');
		const instance = new Razorpay({ key_id, key_secret });

		// 1) Reuse any existing open order to avoid duplicates
		const { data: existing, error: existingErr } = await service
			.from('orders')
			.select('razorpay_order_id, amount_inr, status')
			.eq('user_id', userId)
			.eq('ebook_id', ebook.id)
			.eq('status', 'created')
			.order('created_at', { ascending: false })
			.limit(1)
			.maybeSingle();
		if (!existingErr && existing?.razorpay_order_id) {
			return NextResponse.json({
				orderId: existing.razorpay_order_id,
				amount: Number(existing.amount_inr) * 100,
				currency: 'INR',
				keyId: key_id,
			});
		}

		// 2) Create a new Razorpay order and persist
		const receipt = `eb_${String(ebook.id).slice(0,8)}_${Date.now().toString().slice(-6)}`; // Razorpay receipt <= 40 chars
		let order;
		try {
			order = await instance.orders.create({
				amount: Number(ebook.price_inr) * 100,
				currency: 'INR',
				receipt,
				notes: { ebook_id: String(ebook.id), user_id: userId },
			});
		} catch (e: any) {
			const msg = e?.error?.description || e?.message || 'Razorpay order create failed';
			return NextResponse.json({ error: `Razorpay: ${msg}` }, { status: 500 });
		}

		const { error: orderInsertErr } = await service.from('orders').insert({
			user_id: userId,
			ebook_id: ebook.id,
			razorpay_order_id: order.id,
			amount_inr: Number(ebook.price_inr),
			status: 'created',
		});
		if (orderInsertErr) {
			return NextResponse.json({ error: `DB error (orders): ${orderInsertErr.message}` }, { status: 500 });
		}

		return NextResponse.json({
			orderId: order.id,
			amount: order.amount,
			currency: order.currency,
			keyId: key_id,
		});
	} catch (e: any) {
		const message = e?.message || 'Server error';
		return NextResponse.json({ error: isDev ? message : 'Server error' }, { status: 500 });
	}
}
