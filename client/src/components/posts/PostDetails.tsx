import {
  ArrowLeft,
  MoreHorizontal,
  Heart,
  MessageSquare,
  Repeat,
  Share,
  Image as ImageIcon,
  Smile,
  SendHorizonal,
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { updateLike, type DetailedPost, type Users } from "../../api/posts.api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type PostCardDetailsProps = {
  post: DetailedPost;
};

export default function PostDetail({ post }: PostCardDetailsProps) {
  const navigate = useNavigate();
  const [likeCount, setLikeCount] = useState<Record<string, number>>({});
  const [openLikes, setOpenLikes] = useState(false);
  const [likedUsers, setLikedUsers] = useState<Users[]>([]);
  const [loadingLikes, setLoadingLikes] = useState(false);

  const toggleLike = async (id: string): Promise<void> => {
    try {
      const response = await updateLike(id);
      if (response.success) {
        setLikeCount((prev) => ({
          ...prev,
          [id]: response.data.likeCount,
        }));
        setLikedUsers(post.likes.map((l) => l.user));
      }
    } catch (error) {
      console.error("Like failed", error);
    }
  };

  const handleOpenLikes = async () => {
    setOpenLikes(true);
    setLoadingLikes(true);

    try {
      setLikedUsers(post.likes.map((l) => l.user));
    } catch (err) {
      console.error("Failed to fetch likes", err);
    } finally {
      setLoadingLikes(false);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen w-full bg-[#030303] font-body text-slate-300 selection:bg-lu-accent/30 overflow-auto no-scrollbar">
        <main className="flex-1 flex flex-col max-w-3xl mx-auto border-x border-white/4 bg-[#050505]/30">
          {/* HEADER */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-white/4 sticky top-0 bg-[#030303]/80 backdrop-blur-md bg-black/60 z-50">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                size="icon"
                className="rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
              >
                <ArrowLeft size={20} />
              </Button>
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                Transmission Thread
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-500 hover:text-white rounded-xl"
            >
              <MoreHorizontal size={20} />
            </Button>
          </header>

          <ScrollArea className="flex-1">
            {/* PARENT POST */}
            <div className="p-8 pb-4">
              <div className="flex gap-5">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-12 w-12 rounded-2xl border border-white/8 shadow-2xl">
                    <AvatarFallback className="bg-linear-to-br from-lu-accent to-lu-pink text-white text-xs font-black">
                      AN
                    </AvatarFallback>
                  </Avatar>
                  {/* Thread connector line */}
                  <div className="w-0.5 flex-1 bg-linear-to-b from-white/8 to-transparent rounded-full" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col mb-4">
                    <p className="text-[16px] font-bold text-white tracking-tight leading-none group-hover:text-lu-accent transition-colors cursor-pointer">
                      {post.user.displayName}
                    </p>
                    <p className="text-[11px] font-bold text-slate-600 mt-1.5 uppercase tracking-widest">
                      @{post.user.username}
                    </p>
                  </div>

                  <p className="text-[17px] text-slate-200 leading-[1.6] font-medium">
                    {post.content}
                  </p>

                  <div className="inline-flex items-center mt-6 px-3 py-1 rounded-full bg-white/2 border-white/4">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                      11:13 AM • Apr 1, 2026 •{" "}
                      <span className="text-lu-accent">Global Network</span>
                    </p>
                  </div>

                  <Separator className="my-6 bg-white/4" />

                  {/* STATS SECTION */}
                  <div className="flex gap-8 px-1">
                    <div
                      className="group cursor-pointer"
                      onClick={handleOpenLikes}
                    >
                      <span className="text-sm font-bold text-white group-hover:text-lu-accent transition-colors">
                        {post._count.likes}
                      </span>
                      <span className="ml-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest group-hover:text-slate-400 transition-colors">
                        Signals
                      </span>
                    </div>
                    <div className="group cursor-pointer">
                      <span className="text-sm font-bold text-white group-hover:text-lu-accent transition-colors">
                        {post._count.comments}
                      </span>
                      <span className="ml-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest group-hover:text-slate-400 transition-colors">
                        Responses
                      </span>
                    </div>
                  </div>

                  <Separator className="my-6 bg-white/[0.04]" />

                  {/* ACTION BAR */}
                  <div className="flex justify-between max-w-sm px-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-slate-500 hover:text-lu-accent transition-all hover:scale-110">
                          <MessageSquare size={20} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
                        Reply
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-slate-500 hover:text-teal-400 transition-all hover:scale-110">
                          <Repeat size={20} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
                        Repost
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-8 px-0 flex items-center gap-2 text-[12px] font-bold transition-all ${(likeCount[post.id] ?? post._count.likes) > 0 ? "text-pink-500" : "text-slate-600 hover:text-pink-500"} hover:bg-transparent`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(post.id);
                          }}
                        >
                          <Heart
                            size={16}
                            className={
                              (likeCount[post.id] ?? post._count.likes) > 0
                                ? "fill-pink-500"
                                : ""
                            }
                          />
                          <span className="tabular-nums">
                            {likeCount[post.id] ?? post._count.likes}
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
                        Signal
                      </TooltipContent>
                    </Tooltip>

                    <button className="text-slate-500 hover:text-white transition-all hover:scale-110">
                      <Share size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            <Dialog open={openLikes} onOpenChange={setOpenLikes}>
              <DialogContent className="bg-[#0A0A0A] border-white/10 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xs font-bold tracking-[0.2em] text-slate-400">
                    SIGNALS
                  </DialogTitle>
                </DialogHeader>
                <div className="h-px bg-white/5 my-3" />

                <div className="mt-4 space-y-4 max-h-[400px] overflow-auto no-scrollbar">
                  {loadingLikes ? (
                    <p className="text-slate-500 text-sm">Loading...</p>
                  ) : likedUsers.length === 0 ? (
                    <p className="text-slate-500 text-sm">No signals yet</p>
                  ) : (
                    likedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 hover:bg-white/5 px-2 rounded-xl transition"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl ?? ""} />
                          <AvatarFallback>
                            {user.displayName?.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="text-sm font-bold text-white">
                            {user.displayName}
                          </p>
                          <p className="text-xs text-slate-500">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* REPLY INPUT */}
            <div className="p-8 bg-white/[0.01]">
              <div className="flex gap-5">
                <Avatar className="h-10 w-10 rounded-xl border border-white/[0.05] shadow-lg">
                  <AvatarFallback className="bg-slate-800 text-[10px] font-bold text-slate-400">
                    ME
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 focus-within:border-lu-accent/30 transition-all">
                  <Textarea
                    placeholder="Draft your signal response..."
                    className="bg-transparent border-none text-[15px] p-0 focus-visible:ring-0 resize-none min-h-[60px] placeholder:text-slate-700"
                  />
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-4 text-slate-500">
                      <button className="hover:text-lu-accent transition-colors">
                        <ImageIcon size={18} />
                      </button>
                      <button className="hover:text-lu-accent transition-colors">
                        <Smile size={18} />
                      </button>
                    </div>
                    <Button
                      size="sm"
                      className="bg-white text-black hover:bg-slate-200 font-bold text-[10px] uppercase tracking-widest px-6 rounded-xl h-9"
                    >
                      Post Signal <SendHorizonal size={14} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* COMMENTS SECTION */}
            <div className="divide-y divide-white/[0.04]">
              {post.comments.map((comment, i) => (
                <div
                  key={i}
                  className="p-8 transition-colors hover:bg-white/[0.01] group"
                >
                  <div className="flex gap-5">
                    <Avatar className="h-10 w-10 rounded-xl border border-white/[0.05]">
                      <AvatarFallback className="bg-slate-900 text-[10px] font-bold text-slate-600">
                        AN
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold text-white hover:text-lu-accent transition-colors cursor-pointer">
                            {comment.user.displayName}
                          </span>
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                            @{comment.user.username} • 9m
                          </span>
                        </div>
                        <button className="text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                      <p className="text-[15px] leading-[1.6] text-slate-400 font-medium">
                        {comment.content}
                      </p>
                      <div className="flex gap-8 pt-4">
                        <button className="flex items-center gap-2 text-slate-600 hover:text-pink-500 transition-colors text-[11px] font-bold">
                          <Heart size={16} /> 0
                        </button>
                        <button className="flex items-center gap-2 text-slate-600 hover:text-lu-accent transition-colors text-[11px] font-bold">
                          <MessageSquare size={16} /> Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </main>
      </div>
    </TooltipProvider>
  );
}
