import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steamId = searchParams.get('steamId');
  const STEAM_KEY = process.env.STEAM_API_KEY;

  try {
    // [Codul anterior de Summary & Playtime...]
    const summaryRes = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_KEY}&steamids=${steamId}`);
    const summaryData = await summaryRes.json();
    const user = summaryData.response?.players?.[0];

    // 3. GENERARE ISTORIC MECIURI CU LINEUPS
    const mockMatches = [
      {
        match_id: `M_PREM_${Date.now()}`,
        map_name: "de_ancient",
        team_score: 13,
        enemy_score: 7,
        result: "WIN",
        game_mode: "Premier",
        match_timestamp: new Date().toISOString(),
        demo_url: "https://steamcommunity.com/my/gamedata/730/demo/example",
        players: [
          // Echipa TA (Side A)
          { steam_id: steamId, nickname: user.personaname, team: "SIDE_A", kills: 22, deaths: 12, avatar_url: user.avatarfull },
          { steam_id: "76561198000000001", nickname: "Teammate 1", team: "SIDE_A", kills: 18, deaths: 15, avatar_url: "" },
          // ... restul coechipierilor
          // Echipa ADVERSĂ (Side B)
          { steam_id: "76561198000000005", nickname: "Opponent 1", team: "SIDE_B", kills: 25, deaths: 20, avatar_url: "" },
        ]
      }
    ];

    // 4. UPSERT JUCĂTOR
    await supabase.from('players').upsert({ steam_id: steamId, nickname: user.personaname, avatar_url: user.avatarfull, is_active_career: true });

    // 5. SALVARE MECIURI ȘI LINEUPS
    for (const m of mockMatches) {
      const { players, ...matchData } = m;
      await supabase.from('matches').upsert({ ...matchData, player_steam_id: steamId }, { onConflict: 'match_id' });
      
      const playersToSave = players.map(p => ({ ...p, match_id: m.match_id }));
      await supabase.from('match_players').upsert(playersToSave);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
