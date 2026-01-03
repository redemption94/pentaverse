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
    // 1. DATE GENERALE (Summary, Level, Bans - Deja implementate)
    const summaryRes = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_KEY}&steamids=${steamId}`);
    const summaryData = await summaryRes.json();
    const user = summaryData.response?.players?.[0];

    // 2. ORE & ACTIVITATE RECENTĂ
    const recentRes = await fetch(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${STEAM_KEY}&steamid=${steamId}`);
    const recentData = await recentRes.json();
    const cs2Recent = recentData.response?.games?.find((g: any) => g.appid === 730);
    const recentHours = cs2Recent ? Math.floor(cs2Recent.playtime_2weeks / 60) : 0;

    // 3. --- INTEL: ULTIMUL MECI ---
    // Folosim Match Sharing Code API dacă avem authCode
    let lastMatch = { map: "Unknown", kills: 0, deaths: 0, mvps: 0, score: "N/A", result: "N/A" };
    
    if (authCode && matchToken) {
      try {
        const matchRes = await fetch(`http://api.steampowered.com/ICSGOPlayers_730/GetLastMatchStats/v1/?key=${STEAM_KEY}&steamid=${steamId}&authcode=${authCode}&matchtoken=${matchToken}`);
        if (matchRes.ok) {
          const mData = await matchRes.json();
          // Notă: Structura exactă depinde de datele returnate de Valve pentru CS2
          lastMatch = {
            map: mData.result?.map || "Active Duty Map",
            kills: mData.result?.kills || 0,
            deaths: mData.result?.deaths || 0,
            mvps: mData.result?.mvps || 0,
            score: `${mData.result?.team_score}-${mData.result?.enemy_score}`,
            result: mData.result?.team_score > mData.result?.enemy_score ? "WIN" : "LOSS"
          };
        }
      } catch (e) { console.error("Could not fetch last match stats"); }
    }

    // 4. SALVARE COMPLETĂ
    const { data: player, error: dbError } = await supabase.from('players').upsert({
      steam_id: steamId,
      nickname: user.personaname,
      avatar_url: user.avatarfull,
      recent_playtime_2weeks: recentHours,
      last_match_map: lastMatch.map,
      last_match_kills: lastMatch.kills,
      last_match_deaths: lastMatch.deaths,
      last_match_mvps: lastMatch.mvps,
      last_match_score: lastMatch.score,
      last_match_result: lastMatch.result,
      is_active_career: true,
      penta_scout_score: Math.round((recentHours * 5) + (lastMatch.kills * 2)) 
    }, { onConflict: 'steam_id' }).select().single();

    if (dbError) throw dbError;
    return NextResponse.json({ success: true, player });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
