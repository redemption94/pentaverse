import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Folosim variabilele de server (fără NEXT_PUBLIC_) pentru siguranță în API Routes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    // 1. Validare cu Steam
    const validationParams = new URLSearchParams(params);
    validationParams.set('openid.mode', 'check_authentication');

    const validateRes = await fetch('https://steamcommunity.com/openid/login', {
      method: 'POST',
      body: validationParams,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const validateText = await validateRes.text();
    if (!validateText.includes('is_valid:true')) {
      console.error("Steam validation failed:", validateText);
      return NextResponse.redirect(new URL('/login?error=SteamAuthFailed', request.url));
    }

    // 2. Extragere SteamID
    const claimedId = params['openid.claimed_id'];
    const steamId = claimedId?.split('/').pop();

    if (!steamId) {
      console.error("Could not extract SteamID from:", claimedId);
      return NextResponse.redirect(new URL('/login?error=NoSteamID', request.url));
    }

    // 3. Upsert în Supabase cu LOGS
    console.log("Attempting upsert for SteamID:", steamId);
    
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ steam_id: steamId }, { onConflict: 'steam_id' })
      .select()
      .single();

    if (error) {
      console.error("Supabase Error during upsert:", error.message);
      // Dacă eroarea e de bază de date, o trimitem în URL să o vedem
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url));
    }

    // 4. Succes -> Onboarding
    console.log("Success! Redirecting to onboarding...");
    return NextResponse.redirect(new URL(`/onboarding?steamId=${steamId}`, request.url));

  } catch (err: any) {
    console.error("Critical Callback Error:", err.message);
    return new Response(`Internal Server Error: ${err.message}`, { status: 500 });
  }
}
