import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());

  // 1. Validăm răspunsul cu serverul Steam
  const validationParams = new URLSearchParams(params);
  validationParams.set('openid.mode', 'check_authentication');

  const validateRes = await fetch('https://steamcommunity.com/openid/login', {
    method: 'POST',
    body: validationParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const validateText = await validateRes.text();
  const isValid = validateText.includes('is_valid:true');

  if (!isValid) {
    return NextResponse.redirect('/login?error=InvalidSteamLogin');
  }

  // 2. Extragem SteamID64 din openid.claimed_id
  const claimedId = params['openid.claimed_id'];
  const steamId = claimedId.split('/').pop(); // Ultimul segment este ID-ul

  // 3. Salvăm/Actualizăm profilul în Supabase
  // Notă: În acest pas, de regulă, utilizatorul ar trebui să fie deja logat în Supabase Auth 
  // pentru a face legătura (Link Account). Pentru simplitate, facem upsert pe steam_id.
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ steam_id: steamId }, { onConflict: 'steam_id' })
    .select()
    .single();

  if (error) return NextResponse.redirect('/login?error=DatabaseError');

  // 4. Redirecționăm către Onboarding sau Dashboard
  return NextResponse.redirect(`/profile/onboarding?steamId=${steamId}`);
}
