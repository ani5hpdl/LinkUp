import {
  Heart,
  MessageSquare,
  MoreHorizontal,
  Repeat,
  Share,
} from "lucide-react";
import { updateLike, type Post } from "../api/post";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type PostCardProps = {
  data: Post[];
};

export function PostCard({ data }: PostCardProps) {
  const [likeCount, setLikeCount] = useState<Record<string, number>>({});

  const toggleLike = async (id: string): Promise<void> => {
    try {
      const response = await updateLike(id);
      if (response.success) {
        setLikeCount((prev) => ({
          ...prev,
          [id]: response.data.likeCount,
        }));
      }
    } catch (error) {
      console.error("Like failed", error);
    }
  };

  return (
    <div className="space-y-4">
      {data &&
        data.map((post) => (
          <article
            key={post.id}
            className="group relative rounded-2xl border border-white/3 bg-white/1 p-6 transition-all duration-300 hover:bg-white/2 hover:border-white/8 cursor-pointer"
          >
            <div className="flex gap-5">
              {/* Avatar */}
              <Avatar className="h-10 w-10 rounded-xl shrink-0 border border-white/5 transition-transform group-hover:scale-[1.02]">
                <AvatarImage
                  src={post.user.avatarUrl ?? ""}
                  alt={post.user.displayName ?? "User"}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-xl bg-slate-900 text-slate-500 text-[10px] font-black">
                  {post.user.displayName?.slice(0, 2).toUpperCase() ?? "??"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <header className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    {/* PURPLE HOVER EFFECT HERE */}
                    <span className="text-[14px] font-bold text-white transition-colors group-hover:text-lu-accent">
                      {post.user.displayName}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight whitespace-nowrap">
                      @{post.user.username} • 2h
                    </span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-600 hover:text-white hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all rounded-lg"
                      >
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-[#0A0A0A] border-white/10 text-slate-300 min-w-40"
                    >
                      <DropdownMenuItem className="text-[11px] font-bold uppercase tracking-widest cursor-pointer focus:bg-white/5">
                        Copy link
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[11px] font-bold uppercase tracking-widest cursor-pointer focus:bg-white/5">
                        Bookmark
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[11px] font-bold uppercase tracking-widest cursor-pointer text-pink-500 focus:bg-pink-500/10 focus:text-pink-500">
                        Report post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </header>

                <p className="text-[14px] leading-[1.6] text-slate-300 font-medium wrap-break-word">
                  {post.content}
                </p>

                <footer className="flex items-center justify-between mt-6 max-w-sm">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-0 flex items-center gap-2 text-slate-600 hover:text-lu-accent hover:bg-transparent text-[12px] font-bold transition-colors"
                      >
                        <MessageSquare size={16} />
                        <span className="tabular-nums">
                          {post.commentCount}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
                      Reply
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-0 flex items-center gap-2 text-slate-600 hover:text-teal-400 hover:bg-transparent text-[12px] font-bold transition-colors"
                      >
                        <Repeat size={16} />
                        <span className="tabular-nums">12</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
                      Boost
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 px-0 flex items-center gap-2 text-[12px] font-bold transition-all ${(likeCount[post.id] ?? post.likeCount) > 0 ? "text-pink-500" : "text-slate-600 hover:text-pink-500"} hover:bg-transparent`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(post.id);
                        }}
                      >
                        <Heart
                          size={16}
                          className={
                            (likeCount[post.id] ?? post.likeCount) > 0
                              ? "fill-pink-500"
                              : ""
                          }
                        />
                        <span className="tabular-nums">
                          {likeCount[post.id] ?? post.likeCount}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
                      Signal
                    </TooltipContent>
                  </Tooltip>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-0 text-slate-600 hover:text-white hover:bg-transparent transition-colors"
                  >
                    <Share size={16} />
                  </Button>
                </footer>
              </div>
            </div>
          </article>
        ))}
    </div>
  );
}
