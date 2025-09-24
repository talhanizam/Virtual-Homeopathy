import { NextResponse } from 'next/server';
import { createClientServer } from '@/lib/supabase-server';

export async function POST() {
	const supa = await createClientServer();
	await supa.auth.signOut();
	return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
}
