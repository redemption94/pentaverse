import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const apiKey = process.env.FACEIT_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Variabila FACEIT_API_KEY lipsește din Vercel" }, { status: 500 });
  }

  try {
    // URL CORECTAT: țara se pune ca parametru (?country=ro)
    const res = await fetch(
      'https://open.faceit.com/data/v4/rankings/games/cs2/regions/EU?country=ro&limit=50',
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ 
        success: false, 
        status: res.status, 
        faceit_error: errorText 
      }, { status: res.status });
    }

    const data = await res.json();
    
    // Verificăm dacă am primit jucători
    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ success: true, message: "Nu s-au găsit jucători pentru RO." });
    }

    // Salvăm în Supabase (Logica de Upsert)
    for (const p of data.items) {
      const { data: dbPlayer } = await supabase
        .from('players')
        .upsert({
          faceit_id: p.player_id,
          nickname: p.nickname,
          current_elo: p.faceit_elo,
          avatar_url: p.avatar || null
        }, { onConflict: 'faceit_id' })
        .select()
        .single();

      if (dbPlayer) {
        await supabase.from('elo_history').upsert({
          player_id: dbPlayer.id,
          elo_value: p.faceit_elo,
          recorded_at: new Date().toISOString().split('T')[0]
        }, { onConflict: 'player_id, recorded_at' });
      }
    }

    return NextResponse.json({ 
      success: true, 
      count: data.items.length,
      message: "Sincronizare Pentaverse reușită!" 
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, crash: err.message }, { status: 500 });
  }
}
