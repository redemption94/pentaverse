import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(request: Request) {
  try {
    const { steamId, sharingCode, mapName, teamScore, enemyScore } = await request.json();

    const matchId = `MANUAL_${Date.now()}`;

    // 1. Inserăm Meciul
    const { error: matchError } = await supabase.from('matches').insert({
      match_id: matchId,
      player_steam_id: steamId,
      sharing_code: sharingCode,
      map_name: mapName || "DE_TRAIN",
      team_score: teamScore || 13,
      enemy_score: enemyScore || 0,
      result: teamScore > enemyScore ? 'WIN' : 'LOSS',
      game_mode: 'Premier',
      match_timestamp: new Date().toISOString()
    });

    if (matchError) throw matchError;

    // 2. Inserăm Lineup-ul (pentru a nu apărea gol în UI)
    const { data: player } = await supabase.from('players').select('nickname, avatar_url').eq('steam_id', steamId).single();

    const mockPlayers = [
      { match_id: matchId, steam_id: steamId, nickname: player?.nickname || "You", team: 'SIDE_A', kills: 25, deaths: 10, mvps: 3, avatar_url: player?.avatar_url },
      { match_id: matchId, steam_id: 'bot1', nickname: 'Penta_Teammate', team: 'SIDE_A', kills: 15, deaths: 12 },
      { match_id: matchId, steam_id: 'bot2', nickname: 'Enemy_Player', team: 'SIDE_B', kills: 20, deaths: 20 }
    ];

    await supabase.from('match_players').insert(mockPlayers);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
