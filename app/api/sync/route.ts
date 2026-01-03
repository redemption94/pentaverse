import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const apiKey = process.env.FACEIT_API_KEY;

  // Verificăm dacă Vercel vede cheia
  if (!apiKey) {
    return NextResponse.json({ 
      success: false, 
      error: "Vercel nu citește cheia. Verifică Environment Variables." 
    }, { status: 500 });
  }

  try {
    const res = await fetch(
      'https://open.faceit.com/data/v4/rankings/games/cs2/regions/EU/countries/ro?limit=50',
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store' // Forțăm o cerere nouă
      }
    );

    if (!res.ok) {
      // Aici e cheia: cerem detaliile erorii direct de la Faceit
      const errorText = await res.text();
      return NextResponse.json({ 
        success: false, 
        status: res.status, // Ne va da 401, 403, etc.
        faceit_error: errorText 
      }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, count: data.items.length });

  } catch (err: any) {
    return NextResponse.json({ success: false, crash: err.message }, { status: 500 });
  }
}
