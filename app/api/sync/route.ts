import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function GET() {
  const FACEIT_KEY = process.env.FACEIT_API_KEY;
  const STEAM_KEY = process.env.STEAM_API_KEY;

  try {
    // 1. Luăm topul de la Faceit
    const faceitRes = await fetch('https://open.faceit.com/data/v4/rankings/games/cs2/regions/EU?country=ro&limit=50', {
      headers: { 'Authorization': `Bearer ${FACEIT_KEY}` }
    });
    const faceitData = await faceitRes.json();

    for (const item of faceitData.items) {
      // 2. Pentru fiecare jucător, luăm detaliile de la Faceit (unde e și Steam ID-ul)
      const playerDetailRes = await fetch(`https://open.faceit.com/data/v4/players/${item.player_id}`, {
        headers: { 'Authorization': `Bearer ${FACEIT_KEY}` }
      });
      const details = await playerDetailRes.json();
      const steamId = details.platforms?.steam;

      let playtime = 0;
      // 3. Dacă avem Steam ID, întrebăm Steam de orele de CS2
      if (steamId && STEAM_KEY) {
        const steamRes = await fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_KEY}&steamid=${steamId}&format=json`);
        const steamData = await steamRes.json();
        const cs2 = steamData.response?.games?.find((g: any) => g.appid === 730);
        playtime = cs2 ? Math.floor(cs2.playtime_forever / 60) : 0;
      }

      // 4. Salvăm totul în Supabase
      const { data: p } = await supabase.from('players').upsert({
        faceit_id: item.player_id,
        nickname: item.nickname,
        current_elo: item.faceit_elo,
        avatar_url: item.avatar || null,
        steam_id: steamId || null,
        playtime_hours: playtime
      }, { onConflict: 'faceit_id' }).select().single();

      // Înregistrăm istoricul pentru grafice
      if (p) {
        await supabase.from('elo_history').upsert({
          player_id: p.id,
          elo_value: item.faceit_elo,
          recorded_at: new Date().toISOString().split('T')[0]
        }, { onConflict: 'player_id, recorded_at' });
      }
    }

    return NextResponse.json({ success: true, message: "Sync Faceit + Steam reușit!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
