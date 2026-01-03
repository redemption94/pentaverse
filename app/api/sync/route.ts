import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 1. Configurarea conexiunii cu Supabase folosind variabilele de mediu
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    const FACEIT_API_KEY = process.env.FACEIT_API_KEY;

    if (!FACEIT_API_KEY) {
      return NextResponse.json({ error: 'Lipsește Faceit API Key în Vercel' }, { status: 500 });
    }

    // 2. Interogăm API-ul Faceit pentru top 50 jucători din România (țara: ro)
    const faceitResponse = await fetch(
      'https://open.faceit.com/data/v4/rankings/games/cs2/regions/EU/countries/ro?limit=50',
      {
        headers: {
          'Authorization': `Bearer ${FACEIT_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!faceitResponse.ok) {
      throw new Error('Eroare la comunicarea cu Faceit API');
    }

    const data = await faceitResponse.json();
    const players = data.items;

    // 3. Procesăm fiecare jucător primit
    for (const player of players) {
      // Salvăm sau actualizăm informațiile de bază ale jucătorului
      const { data: dbPlayer, error: upsertError } = await supabase
        .from('players')
        .upsert({
          faceit_id: player.player_id,
          nickname: player.nickname,
          current_elo: player.faceit_elo,
          avatar_url: player.avatar || null,
          last_updated: new Date().toISOString()
        }, { onConflict: 'faceit_id' })
        .select()
        .single();

      if (upsertError) {
        console.error(`Eroare la salvarea jucătorului ${player.nickname}:`, upsertError);
        continue;
      }

      // 4. Salvăm istoricul Elo pentru ziua de azi (snapshot)
      // Acest lucru ne va permite să calculăm dacă elo a crescut sau a scăzut mâine
      await supabase.from('elo_history').upsert({
        player_id: dbPlayer.id,
        elo_value: player.faceit_elo,
        recorded_at: new Date().toISOString().split('T')[0] // format: YYYY-MM-DD
      }, { onConflict: 'player_id, recorded_at' });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Sincronizare reușită pentru ${players.length} jucători.` 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
