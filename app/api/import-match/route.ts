import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { parseCS2Demo } from '../../../lib/demo-analyzer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { steamId, rawLink, mapName, teamScore, enemyScore } = await request.json();

    // 1. Extragem Match ID și Share Code din orice tip de link
    const matchIdMatch = rawLink.match(/\/730\/(\d+)\//);
    const shareCodeMatch = rawLink.match(/CSGO-[\w-]+/);

    const matchId = matchIdMatch ? matchIdMatch[1] : `M_${Date.now()}`;
    const shareCode = shareCodeMatch ? shareCodeMatch[0] : null;

    if (!shareCode) {
      return NextResponse.json({ success: false, error: "Nu am găsit codul CSGO- în link." });
    }

    // Valori default (cele introduse de tine în UI)
    let finalKills = 0;
    let finalDeaths = 0;
    let finalMap = mapName || "DE_TRAIN";
    let isVerified = false;

    // 2. Încercăm parserul DOAR dacă e link de download. Dacă dă eroare, mergem mai departe.
    if (rawLink.includes('.bz2')) {
      try {
        const parsedData = await parseCS2Demo(rawLink, steamId);
        finalKills = parsedData.kills;
        finalDeaths = parsedData.deaths;
        finalMap = parsedData.map;
        isVerified = true;
      } catch (e) {
        console.error("Parser failed, switching to manual mode");
      }
    }

    // 3. Salvare (UPSERT) în tabelul 'matches'
    const { data: match, error: matchError } = await supabase.from('matches').upsert({
      match_id: matchId,
      player_steam_id: steamId,
      sharing_code: shareCode,
      map_name: finalMap,
      team_score: teamScore || 13,
      enemy_score: enemyScore || 0,
      kills: finalKills,
      deaths: finalDeaths,
      result: (teamScore >= enemyScore) ? 'WIN' : 'LOSS',
      match_timestamp: new Date().toISOString(),
      is_verified: isVerified
    }, { onConflict: 'sharing_code' }).select().single();

    if (matchError) throw matchError;

    // 4. Inserăm și un lineup de bază ca să nu apară lista goală la click pe meci
    await supabase.from('match_players').upsert([
      { 
        match_id: matchId, 
        steam_id: steamId, 
        nickname: "You", 
        team: 'SIDE_A', 
        kills: finalKills, 
        deaths: finalDeaths 
      }
    ]);

    return NextResponse.json({ success: true, matchId });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
