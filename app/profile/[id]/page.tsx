'use client';
import { motion } from 'framer-motion';
import { Target, Zap, Shield, Heart, Share2, Award, Globe, ExternalLink, BarChart } from 'lucide-react';

export default function CareerProfile({ params }: { params: { id: string } }) {
  // Aici vom trage datele jucătorului din Supabase pe baza ID-ului
  const player = {
    nickname: "Modo_CS",
    elo: 4342,
    kd: 1.45,
    hs: "62%",
    goal: 1500, // Euro pentru un bootcamp sau monitor nou
    current: 450,
    bio: "Jucător de 19 ani din Timișoara, fost IGL în divizia secundă. Vreau să ajung în FPL și am nevoie de susținere pentru un setup stabil."
  };

  const fundingPercentage = (player.current / player.goal) * 100;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* --- CAREER HEADER --- */}
      <div className="relative h-64 bg-gradient-to-r from-black to-[#1a1a1a] border-b border-[#ffeb00]/30 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="max-w-7xl mx-auto px-6 h-full flex items-end pb-8">
           <div className="flex flex-col md:flex-row gap-8 items-end w-full">
              <div className="w-40 h-40 bg-black border-4 border-[#ffeb00] relative z-10 shadow-[0_0_30px_rgba(255,235,0,0.2)]">
                <img src="/avatar.png" className="w-full h-full object-cover" alt={player.nickname} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-[#ffeb00] text-black text-[9px] font-black px-2 py-0.5 uppercase italic">Pro Pathway Member</span>
                  <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Joined Jan 2026</span>
                </div>
                <h1 className="text-6xl font-[1000] uppercase italic tracking-tighter leading-none">{player.nickname}</h1>
              </div>
              <div className="flex gap-3 mb-2">
                <button className="p-3 bg-white/5 border border-white/10 hover:bg-[#ffeb00] hover:text-black transition-all">
                  <Share2 size={20} />
                </button>
                <button className="px-8 py-3 bg-[#ffeb00] text-black font-[1000] uppercase italic text-xs skew-x-[-15deg] hover:bg-white transition-all">
                  <span className="inline-block skew-x-[15deg]">Connect Faceit</span>
                </button>
              </div>
           </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: CAREER STATS */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-[#111] p-8 border border-white/5 relative">
            <h3 className="text-xl font-[1000] uppercase italic mb-8 flex items-center gap-3 underline decoration-[#ffeb00] underline-offset-8">
              <BarChart className="text-[#ffeb00]" /> Verified Performance
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               <div className="text-center">
                  <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Faceit ELO</p>
                  <p className="text-3xl font-[1000] italic text-[#ffeb00]">{player.elo}</p>
               </div>
               <div className="text-center">
                  <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Avg K/D</p>
                  <p className="text-3xl font-[1000] italic">{player.kd}</p>
               </div>
               <div className="text-center">
                  <p className="text-[10px] text-gray-500 font-black uppercase mb-1">HS Rate</p>
                  <p className="text-3xl font-[1000] italic">{player.hs}</p>
               </div>
               <div className="text-center">
                  <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Impact Rating</p>
                  <p className="text-3xl font-[1000] italic text-blue-400">1.18</p>
               </div>
            </div>
          </section>

          <section className="bg-[#111] p-8 border border-white/5">
            <h3 className="text-xl font-[1000] uppercase italic mb-6">Career Bio</h3>
            <p className="text-gray-400 font-medium leading-relaxed italic text-lg border-l-4 border-[#ffeb00] pl-6">
              "{player.bio}"
            </p>
          </section>
        </div>

        {/* RIGHT COLUMN: SPONSORSHIP CARD */}
        <aside className="space-y-6">
          <div className="bg-[#ffeb00] p-8 text-black skew-y-[-1deg]">
            <div className="skew-y-[1deg]">
              <Heart size={32} className="mb-4 fill-black" />
              <h3 className="text-2xl font-[1000] uppercase italic leading-none mb-2">Sponsor Career</h3>
              <p className="text-[10px] font-black uppercase tracking-wider mb-8 opacity-70">Support this talent to reach Pro Level</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between font-black text-xs uppercase">
                   <span>Progress</span>
                   <span>{player.current}€ / {player.goal}€</span>
                </div>
                <div className="h-4 bg-black/20 w-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${fundingPercentage}%` }} 
                    className="h-full bg-black shadow-[0_0_15px_rgba(0,0,0,0.5)]" 
                   />
                </div>
              </div>

              <button className="w-full bg-black text-[#ffeb00] py-4 font-[1000] uppercase italic text-sm hover:bg-white hover:text-black transition-all border-b-4 border-white/20">
                Sponsor via PayPal/Stripe
              </button>
            </div>
          </div>

          <div className="bg-[#111] p-6 border border-white/5">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Identity Verification</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs bg-black/40 p-3">
                <span className="flex items-center gap-2"><Shield size={14} className="text-[#ffeb00]" /> Steam Linked</span>
                <span className="text-green-500 font-black uppercase italic">Active</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-black/40 p-3">
                <span className="flex items-center gap-2"><Target size={14} className="text-[#ffeb00]" /> Faceit ID</span>
                <span className="text-green-500 font-black uppercase italic">Verified</span>
              </div>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}
