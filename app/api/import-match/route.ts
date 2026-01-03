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

    // 1. Extragem orice ID putem găsi în link
    const shareCodeMatch = rawLink.match(/CSGO-[\w-]+/);
    const numericIdMatch = rawLink.match(/\/730\/(\d+)/); // Match ID din URL-ul Valve

    const shareCode = shareCodeMatch ? shareCodeMatch[0] : null;
    const matchId = numericIdMatch ? numericIdMatch[1] : (shareCode ? `S_${shareCode}` : `M_${Date.now()}`);

    // Dacă nu avem nici Share Code, nici un ID numeric din link, atunci dăm eroare
    if (!shareCode && !numericIdMatch) {
      return NextResponse.json({ success: false, error: "Link invalid. Asigură-te că e link-ul corect de download sau share." });
    }

    let finalStats = { kills: 0, deaths: 0, map: mapName || "DE_TRAIN", players: [] as any[] };
    let isVerified = false;

    // 2. PARSER LOGIC - Dacă e link .bz2, extragem TOT (inclusiv jucătorii reali)
    if (rawLink.includes('.bz2')) {
      try {
        const parsedData = await parseCS2Demo(rawLink, steamId);
        finalStats.kills = parsedData.kills || 0;
        finalStats.deaths = parsedData.deaths || 0;
        finalStats.map = parsedData.map || mapName;
        finalStats.players = parsedData.players || [];
        isVerified = true;
      } catch (e: any) {
        console.error("Parser Error:", e);
        // Dacă parserul dă fail (timeout), mergem mai departe cu datele manuale
      }
    }

    // 3. Salvare Meci
    const { error: matchError } = await supabase.from('matches').upsert({
      match_id: matchId,
      player_steam_id: steamId,
      sharing_code: shareCode,
      map_name: finalStats.map,
      team_score: teamScore || 0,
      enemy_score: enemyScore || 0,
      kills: isVerified ? finalStats.kills : 0,
      deaths: isVerified ? finalStats.deaths : 0,
      result: (teamScore >= enemyScore) ? 'WIN' : 'LOSS',
      match_timestamp: new Date().toISOString(),
      is_verified: isVerified
    }, { onConflict: 'match_id' });

    if (matchError) throw matchError;

    // 4. Salvare Jucători Reali (dacă parserul a reușit)
    if (isVerified && finalStats.players.length > 0) {
      const matchPlayers = finalStats.players.map((p: any) => ({
        match_id: matchId,
        steam_id: p.steam_id,
        nickname: p.nickname,
        team: p.team,
        kills: p.kills,
        deaths: p.deaths
      }));

      await supabase.from('match_players').upsert(matchPlayers, { onConflict: 'match_id, steam_id' });
    } else {
      // Fallback: Te adăugăm măcar pe tine în listă dacă nu a mers parserul
      await supabase.from('match_players').upsert([{
        match_id: matchId,
        steam_id: steamId,
        nickname: "You",
        team: 'SIDE_A',
        kills: 0,
        deaths: 0
      }]);
    }

    return NextResponse.json({ success: true, matchId, verified: isVerified });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
