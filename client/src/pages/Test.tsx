import { 
  MoreHorizontal, Heart, MessageSquare, Repeat, Share, Search, Command, Plus 
} from "lucide-react";

// Assuming you are already using these imports on your main layout
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function Test() {
  return (
    <div className="flex h-screen w-full bg-void font-body text-frost selection:bg-lu-accent/30 overflow-hidden">
      
      {/* (Left Sidebar & Main layout container omitted for brevity) */}

      {/* 2. MAIN FEED AREA */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Post Creation (Keeping the density high, font sizes small and professional) */}
        <div className="border-b border-white/[0.04] p-8">
           <div className="max-w-2xl mx-auto flex gap-6">
              <div className="h-10 w-10 rounded-xl bg-slate-800 border border-white/[0.05] shrink-0" />
              <div className="flex-1 space-y-4">
                <textarea 
                  className="w-full bg-transparent border-none text-[15px] text-slate-200 placeholder:text-slate-600 outline-none resize-none min-h-[60px]"
                  placeholder="What's the signal today?"
                />
                <div className="flex items-center justify-between pt-2">
                   <div className="flex gap-4 text-slate-500">
                      <button className="hover:text-lu-accent transition-colors"><Plus size={18} /></button>
                   </div>
                   <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">0 / 280</p>
                </div>
              </div>
           </div>
        </div>

        {/* --- ENHANCED POST CARDS --- */}
        <div className="max-w-3xl mx-auto py-8 px-6">
          {[1, 2, 3].map((post) => (
            <article key={post} className="group relative mb-8 rounded-2xl border border-white/[0.03] bg-white/[0.01] p-6 transition-all duration-300 hover:bg-white/[0.02] hover:border-white/[0.08]">
              
              {/* Post Header */}
              <div className="flex gap-5">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/[0.05] shrink-0" />
                <div className="flex-1">
                  <header className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-white group-hover:text-lu-accent transition-colors cursor-pointer">itsmeanish635</span>
                      {/* Refined username and metadata */}
                      <span className="text-[11px] font-bold uppercase tracking-tighter text-slate-600">@ANI5HPDL • 2H</span>
                    </div>
                    {/* The ellipsis is now visible on hover */}
                    <button className="text-slate-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                      <MoreHorizontal size={16} />
                    </button>
                  </header>

                  {/* Post Content */}
                  <p className="text-[14px] leading-relaxed text-slate-300 font-medium">
                    Designing systems that scale isn't about complexity. It's about removing the noise. LinkUp v2 is built on this core philosophy.
                  </p>

                  {/* Enhanced Interactions Bar */}
                  <footer className="flex items-center gap-8 mt-6">
                    <button className="flex items-center gap-2 text-slate-600 hover:text-lu-accent transition-all text-[12px] font-bold">
                      <MessageSquare size={16} /> 0
                    </button>
                    <button className="flex items-center gap-2 text-slate-600 hover:text-teal transition-all text-[12px] font-bold">
                      <Repeat size={16} /> 12
                    </button>
                    <button className="flex items-center gap-2 text-slate-600 hover:text-pink transition-all text-[12px] font-bold">
                      <Heart size={16} /> 0
                    </button>
                    <button className="text-slate-600 hover:text-white transition-all">
                      <Share size={16} />
                    </button>
                  </footer>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

    </div>
  );
}