import { createClientServer } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/account';

  if (code) {
    const supabase = await createClientServer();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.session) {
      // Wait a moment to ensure session is properly set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redirect to the specified next URL or default to account page
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    }
  }

  // If there's an error or no code, redirect to login with error message
  return NextResponse.redirect(`${requestUrl.origin}/login?error=Unable to authenticate with Google. Please try again.`);
}

