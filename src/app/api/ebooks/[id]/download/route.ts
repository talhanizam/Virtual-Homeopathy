import { NextResponse } from 'next/server';
import { createClientServer } from '@/lib/supabase-server';
import { createServiceRoleClient } from '@/lib/supabase-server';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const supaSSR = await createClientServer();
	const { data: { user } } = await supaSSR.auth.getUser();
	if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const service = await createServiceRoleClient();
	const { data: purchase } = await service
		.from('purchases')
		.select('ebook_id, ebooks(ebook_file_path, ebook_file_bucket)')
		.eq('user_id', user.id)
		.eq('ebook_id', id)
		.single();

	let rawPath: string | null = null;
	let explicitBucket: string | null = null;

	if (purchase) {
		rawPath = (purchase as any).ebooks?.ebook_file_path as string | null;
		explicitBucket = (purchase as any).ebooks?.ebook_file_bucket as string | null;
	} else {
		// No purchase row: allow if there is a paid order and fetch ebook path directly
		const { data: paidOrder } = await service
			.from('orders')
			.select('id')
			.eq('user_id', user.id)
			.eq('ebook_id', id)
			.eq('status', 'paid')
			.maybeSingle();
		if (!paidOrder) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		const { data: ebookRow } = await service
			.from('ebooks')
			.select('ebook_file_path, ebook_file_bucket')
			.eq('id', id)
			.maybeSingle();
		rawPath = (ebookRow as any)?.ebook_file_path ?? null;
		explicitBucket = (ebookRow as any)?.ebook_file_bucket ?? null;
	}
	if (!rawPath || typeof rawPath !== 'string') {
		return NextResponse.json({ error: 'File path not configured for this ebook' }, { status: 404 });
	}

	// If a full public URL was stored, extract bucket and path
	let bucket = explicitBucket || 'ebook-files';
	let path = rawPath.trim();
	try {
		if (/^https?:\/\//i.test(path)) {
			const url = new URL(path);
			// Expected supabase public format: /storage/v1/object/public/<bucket>/<path>
			const parts = url.pathname.split('/').filter(Boolean);
			const idx = parts.indexOf('public');
			if (idx >= 0 && parts[idx + 1]) {
				bucket = explicitBucket || parts[idx + 1];
				path = parts.slice(idx + 2).join('/');
			}
		}
		// Strip possible bucket prefix and leading slashes
		if (path.startsWith(bucket + '/')) path = path.slice(bucket.length + 1);
		if (path.startsWith('/')) path = path.slice(1);
	} catch {}

	// Attempt signing with derived bucket, then fallback to default bucket if needed
	const trySign = async (bkt: string, p: string) => {
		const { data: signed, error } = await service.storage.from(bkt).createSignedUrl(p, 300);
		return { signedUrl: signed?.signedUrl || null, error };
	};

	let { signedUrl } = await trySign(bucket, path);
	if (!signedUrl && bucket !== 'ebook-files') {
		({ signedUrl } = await trySign('ebook-files', path));
	}
	if (!signedUrl) {
		return NextResponse.json({ error: 'File not found' }, { status: 404 });
	}

	return NextResponse.redirect(signedUrl);
}
