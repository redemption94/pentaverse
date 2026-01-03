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

  if (!steamId || !STEAM_KEY) return NextResponse.json({ success: false, error: "Missing ID or Key" });

  try {
    // 1. Date de profil de bază
    const summaryRes = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_KEY}&steamids=${steamId}`);
    const summaryData = await summaryRes.json();
    const user = summaryData.response?.players?.[0];

    // 2. Upsert Jucător
    await supabase.from('players').upsert({
      steam_id: steamId,
      nickname: user.personaname,
      avatar_url: user.avatarfull,
      is_active_career: true
    }, { onConflict: 'steam_id' });

    // 3. GENERARE 10 MECIURI (ULTIMELE 10)
    // În producție, aici vei itera prin API-ul Valve. Acum populăm pentru test:
    const maps = ["de_mirage", "de_anubis", "de_inferno", "de_ancient", "de_nuke"];
    
    for (let i = 0; i < 10; i++) {
      const match_id = `MATCH_ID_${steamId}_${i}`;
      const match_date = new Date(Date.now() - (i * 3600000 * 24)).toISOString(); // Un meci pe zi în urmă

      // Salvează Meciul
      await supabase.from('matches').upsert({
        match_id: match_id,
        player_steam_id: steamId,
        map_name: maps[i % maps.length],
        team_score: 13,
        enemy_score: Math.floor(Math.random() * 12),
        result: 'WIN',
        game_mode: 'Premier',
        match_timestamp: match_date
      }, { onConflict: 'match_id' });

      // SALVEAZĂ JUCĂTORII (Echipele) - FĂRĂ ACEASTĂ PARTE NU VEI VEDEA NIMIC ÎN LISTĂ
      const playersInMatch = [
        // Echipa TA
        { match_id, steam_id: steamId, nickname: user.personaname, team: 'SIDE_A', kills: 25, deaths: 10, mvps: 3, avatar_url: user.avatarfull },
        { match_id, steam_id: 'S1', nickname: 'Penta_Bot_1', team: 'SIDE_A', kills: 15, deaths: 15, mvps: 1, avatar_url: '' },
        // Echipa Adversă
        { match_id, steam_id: 'E1', nickname: 'Enemy_Pro_1', team: 'SIDE_B', kills: 20, deaths: 20, mvps: 2, avatar_url: '' }
      ];

      await supabase.from('match_players').upsert(playersInMatch);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
