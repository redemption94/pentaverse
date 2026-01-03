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

    // 1. Extragere Match ID și Share Code din link-ul de Steam
    // Format: steam://rungame/730/MATCHID/+csgo_download_match%20SHARECODE
    const matchIdRegex = /\/730\/(\d+)\//;
    const shareCodeRegex = /CSGO-[\w-]+/;

    const matchId = rawLink.match(matchIdRegex)?.[1] || `M_${Date.now()}`;
    const shareCode = rawLink.match(shareCodeRegex)?.[0];

    if (!shareCode) {
      return NextResponse.json({ success: false, error: "Link invalid. Folosește formatul steam:// sau link direct .bz2" });
    }

    let finalStats = { kills: 20, deaths: 15, map: mapName || "DE_TRAIN" };
    let isVerified = false;

    // 2. Încercăm să rulăm parser-ul DOAR dacă avem un link de download direct
    // În viitor, aici poți adăuga un serviciu care transformă ShareCode în DownloadLink
    if (rawLink.includes('.bz2')) {
      try {
        const parsedData = await parseCS2Demo(rawLink, steamId);
        finalStats = parsedData;
        isVerified = true;
      } catch (e) {
        console.log("Parser-ul nu a putut accesa fișierul, folosim date manuale.");
      }
    }

    // 3. Salvare în Supabase
    const { error } = await supabase.from('matches').upsert({
      match_id: matchId,
      player_steam_id: steamId,
      sharing_code: shareCode,
      map_name: finalStats.map,
      team_score: teamScore || 13,
      enemy_score: enemyScore || 0,
      kills: finalStats.kills,
      deaths: finalStats.deaths,
      result: (teamScore > enemyScore) ? 'WIN' : 'LOSS',
      match_timestamp: new Date().toISOString(),
      is_verified: isVerified
    }, { onConflict: 'sharing_code' });

    if (error) throw error;

    return NextResponse.json({ success: true, matchId, shareCode });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
