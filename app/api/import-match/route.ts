import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { steamId, rawLink, mapName, teamScore, enemyScore } = await request.json();

    // REGEX pentru a extrage codul CSGO- din link-ul de Steam
    const matchTokenRegex = /CSGO-[\w-]+/;
    const matchTokenMatch = rawLink.match(matchTokenRegex);
    const sharingCode = matchTokenMatch ? matchTokenMatch[0] : rawLink;

    // Extragem și MatchID-ul numeric dacă există în link
    const numericIdRegex = /\/(\d+)\/\+/;
    const numericIdMatch = rawLink.match(numericIdRegex);
    const matchId = numericIdMatch ? numericIdMatch[1] : `M_${Date.now()}`;

    if (!sharingCode.startsWith('CSGO-')) {
      return NextResponse.json({ success: false, error: "Format invalid. Paste link-ul complet din CS2." });
    }

    // 1. Inserăm Meciul în baza de date
    const { error: matchError } = await supabase.from('matches').upsert({
      match_id: matchId,
      player_steam_id: steamId,
      sharing_code: sharingCode,
      map_name: mapName || "DE_TRAIN",
      team_score: teamScore || 13,
      enemy_score: enemyScore || 0,
      result: teamScore > enemyScore ? 'WIN' : (teamScore === enemyScore ? 'TIE' : 'LOSS'),
      game_mode: 'Premier',
      match_timestamp: new Date().toISOString(),
      demo_url: rawLink // Salvăm link-ul original pentru download
    }, { onConflict: 'sharing_code' });

    if (matchError) throw matchError;

    // 2. Generăm Lineup-ul pentru vizualizare (Până la integrarea unui parser automat)
    const { data: player } = await supabase.from('players').select('nickname, avatar_url').eq('steam_id', steamId).single();

    const mockPlayers = [
      { match_id: matchId, steam_id: steamId, nickname: player?.nickname || "You", team: 'SIDE_A', kills: 24, deaths: 12, mvps: 4, avatar_url: player?.avatar_url },
      { match_id: matchId, steam_id: 'bot1', nickname: 'Friendly_Teammate', team: 'SIDE_A', kills: 18, deaths: 15, mvps: 1 },
      { match_id: matchId, steam_id: 'bot2', nickname: 'Enemy_Sniper', team: 'SIDE_B', kills: 22, deaths: 20, mvps: 2 }
    ];

    await supabase.from('match_players').upsert(mockPlayers);

    return NextResponse.json({ success: true, sharingCode });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
