import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const FACEIT_API_KEY = process.env.FACEIT_API_KEY;

  if (!FACEIT_API_KEY) {
    return NextResponse.json({ error: "Variabila FACEIT_API_KEY lipsește din Vercel" }, { status: 500 });
  }

  const faceitResponse = await fetch(
    'https://open.faceit.com/data/v4/rankings/games/cs2/regions/EU/countries/ro?limit=50',
    {
      headers: {
        'Authorization': `Bearer ${FACEIT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  // DACĂ APARE O EROARE, VREM SĂ VEDEM EXACT CE ZICE FACEIT
  if (!faceitResponse.ok) {
    const errorBody = await faceitResponse.json().catch(() => ({ message: "Nu s-a putut citi corpul erorii" }));
    return NextResponse.json({ 
      success: false, 
      statusCode: faceitResponse.status, 
      faceitMessage: errorBody 
    }, { status: faceitResponse.status });
  }

  const data = await faceitResponse.json();
  return NextResponse.json({ success: true, playersFound: data.items.length });
}
