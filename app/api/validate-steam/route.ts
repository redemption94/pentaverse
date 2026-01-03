import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steamId = searchParams.get('steamId');
  const authCode = searchParams.get('authCode');
  const matchToken = searchParams.get('matchToken');
  const STEAM_KEY = process.env.STEAM_API_KEY;

  if (!steamId || !STEAM_KEY) return NextResponse.json({ success: false, error: "Missing Keys" });

  try {
    // 1. DATE PROFIL (Summary, Level, Bans)
    const summaryRes = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_KEY}&steamids=${steamId}`);
    const summaryData = await summaryRes.json();
    const user = summaryData.response?.players?.[0];

    // 2. ORE JUCATE
    const allGamesRes = await fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_KEY}&steamid=${steamId}&format=json`);
    const allGamesData = await allGamesRes.json();
    const cs2 = allGamesData.response?.games?.find((g: any) => g.appid === 730);
    const totalHours = cs2 ? Math.floor(cs2.playtime_forever / 60) : 0;

    // 3. --- CRAWL MATCH HISTORY ---
    // Dacă avem codurile, simulăm colectarea ultimelor 5 meciuri
    let matchHistory = [];
    if (authCode && matchToken) {
      // Notă: Într-o implementare reală de producție, aici am itera folosind 'GetNextMatchSharingCode'
      // Pentru acest stadiu, inserăm date de test bazate pe structura reală Valve
      matchHistory = [
        { match_id: "CSGO-1", map_name: "de_mirage", kills: 24, deaths: 18, mvps: 4, team_score: 13, enemy_score: 11, result: "WIN" },
        { match_id: "CSGO-2", map_name: "de_inferno", kills: 15, deaths: 20, mvps: 1, team_score: 8, enemy_score: 13, result: "LOSS" },
        { match_id: "CSGO-3", map_name: "de_anubis", kills: 28, deaths: 12, mvps: 6, team_score: 13, enemy_score: 5, result: "WIN" }
      ];
    }

    // 4. UPSERT JUCĂTOR
    const { data: player, error: dbError } = await supabase.from('players').upsert({
      steam_id: steamId,
      nickname: user.personaname,
      avatar_url: user.avatarfull,
      playtime_hours: totalHours,
      is_active_career: true,
      penta_scout_score: Math.round((totalHours / 10) + (matchHistory.length * 10))
    }, { onConflict: 'steam_id' }).select().single();

    if (dbError) throw dbError;

    // 5. SALVARE MECIURI ÎN TABELUL SEPARAT
    if (matchHistory.length > 0) {
      const matchesToInsert = matchHistory.map(m => ({
        ...m,
        player_steam_id: steamId
      }));
      await supabase.from('matches').upsert(matchesToInsert, { onConflict: 'match_id' });
    }

    return NextResponse.json({ success: true, player });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
