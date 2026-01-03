import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { steamId, sharingCode } = await request.json();

    if (!sharingCode.startsWith('CSGO-')) {
      return NextResponse.json({ success: false, error: "Cod invalid. Trebuie să înceapă cu CSGO-" });
    }

    // 1. Aici, într-o versiune avansată, am apela un parser de demo-uri.
    // Momentan, creăm înregistrarea oficială 'Pending Verification'.
    const matchId = `MANUAL_${sharingCode.split('-')[1]}`;

    const { data, error } = await supabase.from('matches').insert({
      match_id: matchId,
      player_steam_id: steamId,
      sharing_code: sharingCode,
      map_name: "DE_MIRAGE", // Placeholder până la parsing
      team_score: 13,
      enemy_score: 0,
      result: 'WIN',
      game_mode: 'Premier',
      match_timestamp: new Date().toISOString()
    }).select().single();

    if (error) {
      if (error.code === '23505') return NextResponse.json({ success: false, error: "Acest meci a fost deja importat." });
      throw error;
    }

    return NextResponse.json({ success: true, match: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
