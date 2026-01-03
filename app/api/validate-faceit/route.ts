import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nickname = searchParams.get('nickname');
  const steamId = searchParams.get('steamId');

  if (!nickname || !steamId) return NextResponse.json({ success: false, error: "Missing data" });

  try {
    const FACEIT_KEY = process.env.FACEIT_API_KEY;

    // 1. Verificăm dacă user-ul există pe Faceit
    const faceitRes = await fetch(`https://open.faceit.com/data/v4/players?nickname=${nickname}&game=cs2`, {
      headers: { 'Authorization': `Bearer ${FACEIT_KEY}` }
    });
    
    if (!faceitRes.ok) throw new Error("Faceit user not found");
    const faceitData = await faceitRes.json();

    // 2. Luăm statisticile
    const statsRes = await fetch(`https://open.faceit.com/data/v4/players/${faceitData.player_id}/stats/cs2`, {
      headers: { 'Authorization': `Bearer ${FACEIT_KEY}` }
    });
    const stats = await statsRes.json();

    const avgKd = parseFloat(stats.lifetime?.['Average K/D Ratio'] || "0");
    const hsPct = parseInt(stats.lifetime?.['Average Headshot %'] || "0");

    // 3. Salvăm în DB și marcăm profilul ca activ pentru carieră
    const { data: player, error } = await supabase.from('players').upsert({
      faceit_id: faceitData.player_id,
      nickname: faceitData.nickname,
      current_elo: faceitData.games?.cs2?.faceit_elo || 0,
      avatar_url: faceitData.avatar || null,
      steam_id: steamId,
      avg_kd: avgKd,
      headshot_pct: hsPct,
      is_active_career: true, // Acum poate primi sponsorizări
      penta_scout_score: Math.round((faceitData.games?.cs2?.faceit_elo / 100) + (avgKd * 30))
    }, { onConflict: 'faceit_id' }).select().single();

    if (error) throw error;

    return NextResponse.json({ success: true, player });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
