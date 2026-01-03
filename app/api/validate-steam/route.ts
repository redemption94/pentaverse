import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steamId = searchParams.get('steamId');
  const STEAM_KEY = process.env.STEAM_API_KEY;

  if (!steamId || !STEAM_KEY) return NextResponse.json({ success: false, error: "Missing ID or Key" });

  try {
    // 1. Date de profil (Avatar, Nume, Level)
    const summaryRes = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_KEY}&steamids=${steamId}`);
    const summaryData = await summaryRes.json();
    const user = summaryData.response.players[0];

    // 2. Ore jucate în CS2
    const gamesRes = await fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_KEY}&steamid=${steamId}&format=json`);
    const gamesData = await gamesRes.json();
    const cs2Game = gamesData.response?.games?.find((g: any) => g.appid === 730);
    const playtime = cs2Game ? Math.floor(cs2Game.playtime_forever / 60) : 0;

    // 3. Statistici de joc (Kills, Deaths, etc.) - Necesită profil PUBLIC
    const statsRes = await fetch(`http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=${STEAM_KEY}&steamid=${steamId}`);
    const statsData = await statsRes.json();
    
    let kills = 0, deaths = 1, hs = 0;
    if (statsData.playerstats?.stats) {
      kills = statsData.playerstats.stats.find((s: any) => s.name === 'total_kills')?.value || 0;
      deaths = statsData.playerstats.stats.find((s: any) => s.name === 'total_deaths')?.value || 1;
      hs = statsData.playerstats.stats.find((s: any) => s.name === 'total_kills_headshot')?.value || 0;
    }

    const kd = parseFloat((kills / deaths).toFixed(2));
    const hsPct = Math.round((hs / (kills || 1)) * 100);

    // 4. Upsert în DB folosind Steam ID ca ancoră
    const { data: player, error } = await supabase.from('players').upsert({
      steam_id: steamId,
      nickname: user.personaname,
      avatar_url: user.avatarfull,
      playtime_hours: playtime,
      avg_kd: kd,
      headshot_pct: hsPct,
      is_active_career: true,
      penta_scout_score: Math.round((playtime / 10) + (kd * 50)) // Algoritm bazat pe grind & impact
    }, { onConflict: 'steam_id' }).select().single();

    if (error) throw error;

    return NextResponse.json({ success: true, player });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Profile is likely PRIVATE or API error" });
  }
}
