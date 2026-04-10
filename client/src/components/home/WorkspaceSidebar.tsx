import { ArrowUpRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import type { User } from "../../api/auth.api";

interface WorkspaceSidebarProps {
  tags: string[];
  user: User | null | undefined;
}

export function WorkspaceSidebar({ tags, user }: WorkspaceSidebarProps) {
  return (
    <aside className="hidden w-64 flex-col border-r border-white/4 bg-[#050505]/50 py-8 px-6 lg:flex">
      <div className="space-y-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
            Workspace
          </p>
          <div className="space-y-1">
            <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/3 text-sm font-bold text-white border border-white/5">
              Global Feed
              <ArrowUpRight size={14} className="text-lu-accent" />
            </button>
            <button className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-white/2 hover:text-slate-300 transition-all">
              Curated Lists
            </button>
          </div>
        </div>

        <Separator className="bg-white/4" />

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
            Favorites
          </p>
          <div className="space-y-3">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-2 px-3 text-[13px] font-semibold text-slate-400 cursor-pointer hover:text-lu-accent transition-colors"
              >
                <span className="text-slate-600">#</span>
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center gap-3 p-3 rounded-2xl border border-white/3 bg-white/2">
        <Avatar className="h-8 w-8 rounded-lg shrink-0">
          <AvatarImage
            src={user?.avatarUrl ?? "/placeholder_avatar.png"}
            alt={user?.displayName ?? "User"}
            className="object-cover"
          />
          <AvatarFallback className="rounded-lg bg-gradient-to-tr from-lu-accent to-lu-pink text-white text-xs font-bold">
            {user?.username?.slice(0, 2).toUpperCase() ?? "??"}
          </AvatarFallback>
        </Avatar>
        <div className="overflow-hidden">
          <p className="text-[12px] font-bold text-white truncate leading-none">
            {user?.username}
          </p>
          <Badge
            variant="outline"
            className="mt-1 h-4 px-1.5 text-[9px] font-black uppercase tracking-widest text-slate-500 border-white/10 bg-transparent"
          >
            Pro Plan
          </Badge>
        </div>
      </div>
    </aside>
  );
}
