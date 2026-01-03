import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

// Dezactivăm orice formă de cache pentru a evita 404 pe profile noi
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ProfilePage({ params }: { params: { id: string } }) {
  // Așteptăm parametrii (necesar în versiunile noi de Next.js)
  const id = params.id;

  // Căutăm în coloana faceit_id
  const { data: player, error } = await supabase
    .from('players')
    .select('*')
    .eq('faceit_id', id)
    .single();

  if (error || !player) {
    console.error("Player not found in DB:", error);
    return notFound(); // Aceasta va afișa pagina 404 standard dacă jucătorul chiar nu e în DB
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="border border-[#ffeb00] p-10 bg-[#0a0a0a] text-center">
        <h1 className="text-5xl font-black italic uppercase mb-4">{player.nickname}</h1>
        <p className="text-[#ffeb00] font-mono">Verified Pro Pathway Asset</p>
        <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4">
                <p className="text-[10px] text-gray-500 uppercase">Faceit Elo</p>
                <p className="text-2xl font-bold">{player.current_elo}</p>
            </div>
            <div className="bg-white/5 p-4">
                <p className="text-[10px] text-gray-500 uppercase">Scout Score</p>
                <p className="text-2xl font-bold text-[#ffeb00]">{player.penta_scout_score}</p>
            </div>
        </div>
      </div>
    </div>
  );
}
