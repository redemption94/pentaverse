import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function GET() {
  const FACEIT_KEY = process.env.FACEIT_API_KEY;
  const STEAM_KEY = process.env.STEAM_API_KEY;

  try {
    // 1. Luăm top 100 jucători din România (extindem baza pentru rising stars)
    const faceitRes = await fetch('https://open.faceit.com/data/v4/rankings/games/cs2/regions/EU?country=ro&limit=100', {
      headers: { 'Authorization': `Bearer ${FACEIT_KEY}` }
    });
    const faceitData = await faceitRes.json();

    for (const item of faceitData.items) {
      // 2. Luăm ID-ul de Steam din profilul Faceit
      const playerDetailRes = await fetch(`https://open.faceit.com/data/v4/players/${item.player_id}`, {
        headers: { 'Authorization': `Bearer ${FACEIT_KEY}` }
      });
      const details = await playerDetailRes.json();
      const steamId = details.platforms?.steam;

      // 3. Luăm statisticile specifice de CS2 (K/D, HS%, WinRate)
      const statsRes = await fetch(`https://open.faceit.com/data/v4/players/${item.player_id}/stats/cs2`, {
        headers: { 'Authorization': `Bearer ${FACEIT_KEY}` }
      });
      const stats = await statsRes.json();
      
      const avgKd = parseFloat(stats.lifetime?.['Average K/D Ratio'] || "0");
      const winRate = parseInt(stats.lifetime?.['Win Rate %'] || "0");
      const hsPct = parseInt(stats.lifetime?.['Average Headshot %'] || "0");

      // 4. Luăm orele de pe Steam (pentru a măsura "Talent vs Grind")
      let playtime = 0;
      if (steamId && STEAM_KEY) {
        const steamRes = await fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_KEY}&steamid=${steamId}&format=json`);
        const steamData = await steamRes.json();
        const cs2 = steamData.response?.games?.find((g: any) => g.appid === 730);
        playtime = cs2 ? Math.floor(cs2.playtime_forever / 60) : 0;
      }

      // 5. CALCULĂM PENTA SCOUT SCORE
      // Formula favorizează K/D-ul mare și eficiența (ore puține/elo mare)
      const eloFactor = item.faceit_elo / 100;
      const kdFactor = avgKd * 20;
      const efficiencyBonus = playtime > 0 ? (item.faceit_elo / playtime) * 10 : 0;
      const scoutScore = Math.round(eloFactor + kdFactor + efficiencyBonus);

      // 6. Salvăm tot dosarul în Supabase
      await supabase.from('players').upsert({
        faceit_id: item.player_id,
        nickname: item.nickname,
        current_elo: item.faceit_elo,
        avatar_url: item.avatar || null,
        steam_id: steamId || null,
        playtime_hours: playtime,
        avg_kd: avgKd,
        win_rate_pct: winRate,
        headshot_pct: hsPct,
        penta_scout_score: scoutScore
      }, { onConflict: 'faceit_id' });
    }

    return NextResponse.json({ success: true, message: "Scouting Database Updated: Romania Edition" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
