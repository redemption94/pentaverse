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

    // Debugging: vedem ce link primim
    console.log("Link primit pentru procesare:", rawLink);

    // 1. Încercăm să găsim orice fel de ID în link
    const shareCodeRegex = /CSGO-[\w-]+/;
    const matchIdRegex = /\/730\/(\d+)/;

    const shareCodeMatch = rawLink.match(shareCodeRegex);
    const matchIdMatch = rawLink.match(matchIdRegex);

    const shareCode = shareCodeMatch ? shareCodeMatch[0] : null;
    const matchId = matchIdMatch ? matchIdMatch[1] : (shareCode ? `S_${shareCode}` : `M_${Date.now()}`);

    // LOGICĂ NOUĂ: Dacă nu avem nici ShareCode nici MatchID din URL, doar atunci dăm eroare
    if (!shareCode && !matchIdMatch) {
      return NextResponse.json({ 
        success: false, 
        error: "DEBUG: Link-ul nu conține nici CSGO-code, nici MatchID (/730/...). Verifică link-ul!" 
      });
    }

    let finalStats = { kills: 0, deaths: 0, map: mapName || "DE_TRAIN", players: [] as any[] };
    let isVerified = false;

    // 2. PARSER: Doar dacă link-ul este de download direct (.bz2)
    if (rawLink.includes('.bz2')) {
      try {
        console.log("Pornim parserul pentru link .bz2...");
        const parsedData = await parseCS2Demo(rawLink, steamId);
        finalStats.kills = parsedData.kills || 0;
        finalStats.deaths = parsedData.deaths || 0;
        finalStats.map = parsedData.map || mapName;
        finalStats.players = parsedData.players || [];
        isVerified = true;
      } catch (parserError) {
        console.error("Parserul a eșuat, salvăm doar metadatele:", parserError);
      }
    }

    // 3. SALVARE MECI
    const { error: matchError } = await supabase.from('matches').upsert({
      match_id: matchId,
      player_steam_id: steamId,
      sharing_code: shareCode,
      map_name: finalStats.map,
      team_score: teamScore || 0,
      enemy_score: enemyScore || 0,
      kills: finalStats.kills,
      deaths: finalStats.deaths,
      result: (teamScore >= enemyScore) ? 'WIN' : 'LOSS',
      match_timestamp: new Date().toISOString(),
      is_verified: isVerified
    }, { onConflict: 'match_id' });

    if (matchError) throw matchError;

    // 4. SALVARE JUCĂTORI (Dacă parserul a găsit ceva)
    if (isVerified && finalStats.players.length > 0) {
      const playersToSave = finalStats.players.map((p: any) => ({
        match_id: matchId,
        steam_id: p.steam_id,
        nickname: p.nickname,
        team: p.team,
        kills: p.kills,
        deaths: p.deaths
      }));
      await supabase.from('match_players').upsert(playersToSave, { onConflict: 'match_id, steam_id' });
    } else {
      // Fallback: te adăugăm măcar pe tine ca să poți vedea meciul pe profil
      await supabase.from('match_players').upsert([{
        match_id: matchId,
        steam_id: steamId,
        nickname: "Player Principal",
        team: 'SIDE_A',
        kills: finalStats.kills,
        deaths: finalStats.deaths
      }], { onConflict: 'match_id, steam_id' });
    }

    return NextResponse.json({ success: true, matchId, isVerified });

  } catch (err: any) {
    console.error("Eroare API Import:", err);
    return NextResponse.json({ success: false, error: "Eroare Server: " + err.message });
  }
}
