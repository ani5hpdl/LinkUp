import { Plus } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { User } from "../../api/auth.api";

interface PostComposerProps {
  user: User | null | undefined;
}

export function PostComposer({ user }: PostComposerProps) {
  const [charCount, setCharCount] = useState(0);

  return (
    <div className="border-b border-white/4 p-8">
      <div className="max-w-2xl mx-auto flex gap-6">
        <Avatar className="h-10 w-10 rounded-xl shrink-0">
          <AvatarImage
            src={user?.avatarUrl ?? "/placeholder_avatar.png"}
            alt={user?.displayName ?? "User"}
            className="object-cover"
          />
          <AvatarFallback className="rounded-xl bg-slate-800 border border-white/5 text-slate-500 text-xs font-bold">
            {user?.username?.slice(0, 2).toUpperCase() ?? "??"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-4">
          <textarea
            className="w-full bg-transparent border-none text-[15px] text-slate-200 placeholder:text-slate-600 outline-none resize-none min-h-15"
            placeholder="What's the signal today?"
            maxLength={280}
            onChange={(e) => setCharCount(e.target.value.length)}
          />
          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-4 text-slate-500">
              <button className="hover:text-lu-accent transition-colors">
                <Plus size={18} />
              </button>
            </div>
            <p
              className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                charCount >= 260
                  ? "text-lu-pink"
                  : charCount >= 200
                    ? "text-yellow-500"
                    : "text-slate-600"
              }`}
            >
              {charCount} / 280
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
