import { NextResponse } from 'next/server';
import { createClientServer } from '@/lib/supabase-server';
import { createServiceRoleClient } from '@/lib/supabase-server';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const supaSSR = await createClientServer();
	const { data: { user } } = await supaSSR.auth.getUser();
	if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const service = createServiceRoleClient();
	const { data: purchase } = await service
		.from('purchases')
		.select('ebook_id, ebooks(ebook_file_path)')
		.eq('user_id', user.id)
		.eq('ebook_id', id)
		.single();

	if (!purchase) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	const filePath = (purchase as any).ebooks.ebook_file_path as string;

	const { data: signed, error } = await service.storage
		.from('ebook-files')
		.createSignedUrl(filePath, 60);
	if (error || !signed?.signedUrl) return NextResponse.json({ error: 'File not found' }, { status: 404 });

	return NextResponse.redirect(signed.signedUrl);
}
