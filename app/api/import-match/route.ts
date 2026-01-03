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

    // Extragem link-ul curat (URL-ul de bz2)
    const demoUrlRegex = /(https?:\/\/[^\s]+?\.dem\.bz2)/;
    const demoUrl = rawLink.match(demoUrlRegex)?.[0];

    if (!demoUrl) {
      return NextResponse.json({ success: false, error: "Link de demo invalid sau expirat." });
    }

    // Rulăm Parser-ul
    const realData = await parseCS2Demo(demoUrl, steamId);

    // Salvăm datele extrase în baza de date
    const matchId = `PARSED_${Date.now()}`;
    const { error } = await supabase.from('matches').insert({
      match_id: matchId,
      player_steam_id: steamId,
      map_name: realData.map || mapName,
      team_score: teamScore || 0,
      enemy_score: enemyScore || 0,
      kills: realData.kills,
      deaths: realData.deaths,
      result: (teamScore > enemyScore) ? 'WIN' : 'LOSS',
      match_timestamp: new Date().toISOString(),
      is_verified: true
    });

    if (error) throw error;

    return NextResponse.json({ success: true, stats: realData });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
