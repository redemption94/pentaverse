import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { parseCS2Demo } from '../../../lib/demo-analyzer';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(request: Request) {
  try {
    const { steamId, rawLink, mapName, teamScore, enemyScore } = await request.json();

    const matchId = rawLink.match(/\/730\/(\d+)\//)?.[1] || `M_${Date.now()}`;
    const shareCode = rawLink.match(/CSGO-[\w-]+/)?.[0];

    if (!shareCode) return NextResponse.json({ success: false, error: "Link invalid" });

    // 1. Verificăm dacă avem link de download (.bz2) pentru jucători reali
    if (!rawLink.includes('.bz2')) {
      return NextResponse.json({ 
        success: false, 
        error: "Pentru a importa jucătorii REALI, ai nevoie de Download Link (.bz2) din 'Personal Game Data'." 
      });
    }

    // 2. Parsăm demo-ul real
    const parsedData = await parseCS2Demo(rawLink, steamId);

    // 3. Salvăm Meciul
    await supabase.from('matches').upsert({
      match_id: matchId,
      player_steam_id: steamId,
      sharing_code: shareCode,
      map_name: parsedData.map,
      team_score: teamScore,
      enemy_score: enemyScore,
      is_verified: true,
      match_timestamp: new Date().toISOString()
    }, { onConflict: 'sharing_code' });

    // 4. Salvăm JUCĂTORII REALI (Toți cei 10)
    const matchPlayers = parsedData.players.map((p: any) => ({
      match_id: matchId,
      steam_id: p.steam_id,
      nickname: p.nickname,
      team: p.team,
      kills: p.kills,
      deaths: p.deaths
    }));

    const { error: playersError } = await supabase.from('match_players').upsert(matchPlayers, { onConflict: 'match_id, steam_id' });
    
    if (playersError) throw playersError;

    return NextResponse.json({ success: true, count: matchPlayers.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
