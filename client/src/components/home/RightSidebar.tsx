import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

export function RightSidebar() {
  return (
    <aside className="hidden xl:flex w-80 flex-col border-l border-white/4 bg-[#050505]/30 p-8 gap-8">
      <div className="space-y-6">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
          Network Health
          <span className="h-1.5 w-1.5 rounded-full bg-teal shadow-[0_0_8px_#2dd4bf]" />
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Users", value: "2.4k" },
            { label: "Posts", value: "18k" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl border border-white/3 bg-white/2"
            >
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                {stat.label}
              </p>
              <p className="text-xl font-display font-bold text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-white/4" />

      <div className="space-y-6">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
          Top Signals
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-start gap-3 group cursor-pointer"
            >
              <div className="h-8 w-8 rounded-lg bg-white/3 flex items-center justify-center text-[10px] font-bold text-slate-600 group-hover:text-lu-accent transition-colors shrink-0">
                0{i}
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-300 leading-tight">
                  Implementing Prisma sorting for better feed performance.
                </p>
                <Badge
                  variant="outline"
                  className="mt-1.5 h-4 px-1.5 text-[9px] font-bold border-white/10 text-slate-500 bg-transparent"
                >
                  #Development
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
