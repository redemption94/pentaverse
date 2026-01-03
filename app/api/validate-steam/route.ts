import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steamId = searchParams.get('steamId');
  const authCode = searchParams.get('authCode');
  const matchToken = searchParams.get('matchToken');
  const STEAM_KEY = process.env.STEAM_API_KEY;

  if (!steamId || !STEAM_KEY) {
    return NextResponse.json({ success: false, error: "Cheia API Steam lipsește din Vercel." });
  }

  try {
    // 1. Fetch Player Summary
    const summaryRes = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_KEY}&steamids=${steamId}`);
    const summaryData = await summaryRes.json();
    const user = summaryData.response?.players?.[0];

    if (!user) throw new Error("Nu am putut găsi profilul Steam.");

    // 2. Fetch Playtime
    let playtime = 0;
    try {
      const gamesRes = await fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_KEY}&steamid=${steamId}&format=json`);
      const gamesData = await gamesRes.json();
      const cs2Game = gamesData.response?.games?.find((g: any) => g.appid === 730);
      playtime = cs2Game ? Math.floor(cs2Game.playtime_forever / 60) : 0;
    } catch (e) { console.log("Playtime privat"); }

    // 3. Fetch Combat Stats (Legacy API)
    let kills = 0, deaths = 1, hs = 0;
    try {
      const statsRes = await fetch(`http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=${STEAM_KEY}&steamid=${steamId}`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        const statsArray = statsData.playerstats?.stats || [];
        kills = statsArray.find((s: any) => s.name === 'total_kills')?.value || 0;
        deaths = statsArray.find((s: any) => s.name === 'total_deaths')?.value || 1;
        hs = statsArray.find((s: any) => s.name === 'total_kills_headshot')?.value || 0;
      }
    } catch (e) { console.log("Stats private"); }

    const kd = parseFloat((kills / (deaths || 1)).toFixed(2));
    const hsPct = Math.round((hs / (kills || 1)) * 100);

    // 4. Calculăm Scout Score
    // Formula: $ScoutScore = \frac{Playtime}{5} + (KD \times 50)$
    const scoutScore = Math.round((playtime / 5) + (kd * 50));

    // 5. UPSERT în Supabase
    const { data: player, error: dbError } = await supabase.from('players').upsert({
      steam_id: steamId,
      nickname: user.personaname,
      avatar_url: user.avatarfull,
      playtime_hours: playtime,
      avg_kd: kd,
      headshot_pct: hsPct,
      steam_auth_code: authCode || null,
      latest_match_token: matchToken || null,
      is_active_career: true,
      penta_scout_score: scoutScore
    }, { onConflict: 'steam_id' }).select().single();

    if (dbError) {
      console.error("Supabase Error:", dbError);
      throw new Error(`Eroare Bază de Date: ${dbError.message}`);
    }

    return NextResponse.json({ success: true, player });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
