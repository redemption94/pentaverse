import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function GET() {
  const FACEIT_KEY = process.env.FACEIT_API_KEY;
  const STEAM_KEY = process.env.STEAM_API_KEY;

  if (!FACEIT_KEY || !STEAM_KEY) {
    return NextResponse.json({ error: "Missing API Keys" }, { status: 500 });
  }

  try {
    // Reducem la 20 pentru a evita timeout-ul pe Vercel
    const faceitRes = await fetch('https://open.faceit.com/data/v4/rankings/games/cs2/regions/EU?country=ro&limit=20', {
      headers: { 'Authorization': `Bearer ${FACEIT_KEY}` }
    });

    if (!faceitRes.ok) throw new Error("Faceit Ranking API returned HTML/Error");
    const faceitData = await faceitRes.json();

    for (const item of faceitData.items) {
      try {
        // 1. Detalii Jucător (pentru Steam ID)
        const detailRes = await fetch(`https://open.faceit.com/data/v4/players/${item.player_id}`, {
          headers: { 'Authorization': `Bearer ${FACEIT_KEY}` }
        });
        if (!detailRes.ok) continue;
        const details = await detailRes.json();
        const steamId = details.platforms?.steam;

        // 2. Statistici CS2 (K/D, HS)
        const statsRes = await fetch(`https://open.faceit.com/data/v4/players/${item.player_id}/stats/cs2`, {
          headers: { 'Authorization': `Bearer ${FACEIT_KEY}` }
        });
        if (!statsRes.ok) continue;
        const stats = await statsRes.json();

        const avgKd = parseFloat(stats.lifetime?.['Average K/D Ratio'] || "0");
        const winRate = parseInt(stats.lifetime?.['Win Rate %'] || "0");
        const hsPct = parseInt(stats.lifetime?.['Average Headshot %'] || "0");

        // 3. Ore Steam
        let playtime = 0;
        if (steamId) {
          const steamRes = await fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_KEY}&steamid=${steamId}&format=json`);
          if (steamRes.ok) {
            const steamData = await steamRes.json();
            const cs2 = steamData.response?.games?.find((g: any) => g.appid === 730);
            playtime = cs2 ? Math.floor(cs2.playtime_forever / 60) : 0;
          }
        }

        // 4. Calcul Scor Scouting
        const scoutScore = Math.round((item.faceit_elo / 100) + (avgKd * 25));

        // 5. Update Database
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

      } catch (innerError) {
        console.error(`Skipping player ${item.nickname} due to error`);
        continue;
      }
    }

    return NextResponse.json({ success: true, message: "Sync Partial (Top 20) Reușit" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
