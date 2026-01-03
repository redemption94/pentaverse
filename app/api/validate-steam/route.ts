import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steamId = searchParams.get('steamId');
  const STEAM_KEY = process.env.STEAM_API_KEY;

  if (!steamId || !STEAM_KEY) return NextResponse.json({ success: false, error: "Missing Steam ID or API Key" });

  try {
    // 1. Fetch Date Profil (Summary)
    const summaryRes = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_KEY}&steamids=${steamId}`);
    const summaryData = await summaryRes.json();
    const user = summaryData.response?.players?.[0];

    if (!user) throw new Error("User not found on Steam");

    // 2. Upsert Jucător Principal
    await supabase.from('players').upsert({
      steam_id: steamId,
      nickname: user.personaname,
      avatar_url: user.avatarfull,
      is_active_career: true
    }, { onConflict: 'steam_id' });

    // 3. Generăm ultimele 10 meciuri cronologic
    // Folosim un array de hărți CS2 reale
    const maps = ["de_mirage", "de_anubis", "de_ancient", "de_inferno", "de_nuke", "de_vertigo", "de_overpass"];
    
    for (let i = 0; i < 10; i++) {
      const match_id = `CS2_MATCH_${steamId}_${i}`;
      // Creăm date diferite: cel mai recent meci este "acum", următoarele sunt în trecut (-3 ore fiecare)
      const matchDate = new Date();
      matchDate.setHours(matchDate.getHours() - (i * 3)); 
      const timestamp = matchDate.toISOString();

      // Salvează Meciul cu Timestampul corect
      await supabase.from('matches').upsert({
        match_id: match_id,
        player_steam_id: steamId,
        map_name: maps[i % maps.length],
        team_score: 13,
        enemy_score: Math.floor(Math.random() * 12),
        result: i % 3 === 0 ? 'LOSS' : 'WIN',
        game_mode: 'Premier',
        match_timestamp: timestamp
      }, { onConflict: 'match_id' });

      // 4. Salvează Jucătorii din meci (Lineup)
      // Generăm coechipieri și adversari pentru a popula vizual tabelul
      const matchPlayers = [
        // Echipa TA (SIDE_A)
        { match_id, steam_id: steamId, nickname: user.personaname, team: 'SIDE_A', kills: 22 + i, deaths: 15, mvps: 3, avatar_url: user.avatarfull },
        { match_id, steam_id: `TEAM1_${i}`, nickname: `Teammate_${i}`, team: 'SIDE_A', kills: 18, deaths: 14, mvps: 1, avatar_url: '' },
        { match_id, steam_id: `TEAM2_${i}`, nickname: `Support_Guy`, team: 'SIDE_A', kills: 12, deaths: 18, mvps: 0, avatar_url: '' },
        
        // Echipa Adversă (SIDE_B)
        { match_id, steam_id: `ENEMY1_${i}`, nickname: `Opponent_Pro`, team: 'SIDE_B', kills: 25, deaths: 20, mvps: 2, avatar_url: '' },
        { match_id, steam_id: `ENEMY2_${i}`, nickname: `Enemy_Sniper`, team: 'SIDE_B', kills: 21, deaths: 15, mvps: 1, avatar_url: '' }
      ];

      await supabase.from('match_players').upsert(matchPlayers);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
