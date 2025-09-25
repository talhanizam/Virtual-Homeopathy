import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
	try {
		const { path } = await req.json();
		if (!path || typeof path !== 'string') {
			return NextResponse.json({ error: 'Missing path' }, { status: 400 });
		}
		const supa = await createServiceRoleClient();
		const { data, error } = await supa.storage.from('ebook-covers').createSignedUrl(path, 3600);
		if (error || !data?.signedUrl) {
			return NextResponse.json({ error: 'Unable to sign cover' }, { status: 404 });
		}
		return NextResponse.json({ url: data.signedUrl });
	} catch (e: any) {
		return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
	}
}
