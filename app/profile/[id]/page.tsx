import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

// FORȚĂM PAGINA SĂ FIE DINAMICĂ (nu mai afișează date vechi/cached)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ProfilePage({ params }: { params: { id: string } }) {
  // Căutăm jucătorul după FACEIT_ID (cel din URL)
  const { data: player, error } = await supabase
    .from('players')
    .select('*')
    .eq('faceit_id', params.id)
    .single();

  // Dacă nu găsim nimic sau e eroare, dăm 404
  if (error || !player) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white p-12">
      {/* Verifică dacă acest nume este cel corect acum */}
      <h1 className="text-6xl font-[1000] uppercase italic tracking-tighter">
        {player.nickname}
      </h1>
      <div className="mt-4 flex gap-4">
        <span className="bg-[#ffeb00] text-black px-3 py-1 font-bold">
          ELO: {player.current_elo}
        </span>
        <span className="border border-white/20 px-3 py-1">
          K/D: {player.avg_kd}
        </span>
      </div>
      
      {/* Restul designului tău de profil... */}
      <p className="mt-10 text-gray-500 uppercase text-[10px] tracking-widest">
        Dossier ID: {player.faceit_id}
      </p>
    </div>
  );
}
