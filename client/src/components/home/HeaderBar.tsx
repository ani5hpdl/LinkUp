import { Command, Plus, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function HeaderBar() {
  return (
    <header className="sticky top-0 z-40 h-16 flex items-center justify-between border-b border-white/4 bg-[#030303]/80 px-8 backdrop-blur-xl">
      <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">
        Transmission Feed
      </h2>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 z-10"
            size={14}
          />
          <Input
            className="h-9 w-64 rounded-lg bg-white/3 border-white/5 pl-9 pr-10 text-[12px] text-white placeholder:text-slate-600 outline-none focus-visible:border-lu-accent/50 focus-visible:ring-0 transition-all"
            placeholder="Command + K to search..."
          />
          <Command
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
            size={12}
          />
        </div>
        <Button className="h-9 rounded-lg bg-white text-black font-bold text-[11px] uppercase tracking-widest px-4 hover:bg-slate-200">
          <Plus size={14} className="mr-1" /> New Post
        </Button>
      </div>
    </header>
  );
}
