import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// În Next.js 15+, params trebuie să fie AWAIT-uit
export default async function ProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const profileId = params.id;

  console.log("Searching for player with Faceit ID:", profileId);

  const { data: player, error } = await supabase
    .from('players')
    .select('*')
    .eq('faceit_id', profileId)
    .single();

  // DEBUG: Dacă nu găsim jucătorul, afișăm o pagină de eroare custom în loc de 404 generic
  if (error || !player) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10 text-center">
        <h1 className="text-2xl font-black text-red-500 mb-4">ASSET NOT FOUND IN RADAR</h1>
        <p className="text-gray-500 font-mono text-xs">ID: {profileId}</p>
        <p className="mt-4 text-gray-400">Verifică dacă jucătorul a finalizat procesul de Onboarding.</p>
        <a href="/" className="mt-8 text-[#ffeb00] underline uppercase text-[10px] font-black">Back to Main Radar</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-12 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-[#0a0a0a] border border-[#ffeb00]/20 p-12 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#ffeb00]"></div>
        
        <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] mb-8 block">
          Verified Player Dossier
        </span>
        
        <h1 className="text-6xl font-[1000] uppercase italic tracking-tighter mb-6">
          {player.nickname}
        </h1>

        <div className="grid grid-cols-2 gap-6 border-t border-white/5 pt-8">
          <div>
            <p className="text-[9px] font-black text-gray-500 uppercase">Faceit Elo</p>
            <p className="text-3xl font-black text-[#ffeb00] italic">{player.current_elo}</p>
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-500 uppercase">Scout Score</p>
            <p className="text-3xl font-black italic">{player.penta_scout_score}</p>
          </div>
        </div>

        <div className="mt-12 bg-white/5 p-4 flex justify-between items-center">
           <span className="text-[9px] font-bold text-gray-400">STATUS: ACTIVE CAREER</span>
           <div className="flex gap-1">
              {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-3 bg-[#ffeb00]"></div>)}
           </div>
        </div>
      </div>
    </div>
  );
}
