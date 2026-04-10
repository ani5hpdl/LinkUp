import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import type { ReactNode } from "react";

export interface NavItem {
  icon: ReactNode;
  label: string;
  active?: boolean;
}

interface NavRailProps {
  items: NavItem[];
}

export function NavRail({ items }: NavRailProps) {
  return (
    <aside className="flex w-18 flex-col items-center border-r border-white/4 py-6 bg-[#050505]">
      <div className="mb-10 h-8 w-8 rounded-xl bg-lu-accent flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.4)]">
        <img src="/logo.png" alt="" />
      </div>

      <nav className="flex flex-col gap-4">
        {items.map((item) => (
          <Tooltip key={item.label}>
            <TooltipTrigger asChild>
              <button
                className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${
                  item.active
                    ? "bg-white/5 text-lu-accent border border-white/5"
                    : "text-slate-500 hover:text-slate-200 hover:bg-white/2"
                }`}
              >
                {item.icon}
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-surface2 border-white/10 text-slate-200 text-xs"
            >
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </aside>
  );
}
