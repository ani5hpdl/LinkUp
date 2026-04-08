import {
  Home as HomeIcon,
  Compass,
  Bell,
  Inbox,
  Bookmark,
  ArrowUpRight,
  Plus,
  Search,
  Command,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { useEffect, useState } from "react";
import { getExplore, type Post } from "../api/posts.api";
import { getMe, refreshToken } from "../api/auth.api";
import type { User } from "../api/auth.api";
import { PostCard } from "../components/PostCard";
import axios from "axios";

export interface postData {
  posts: Post[];
  count: number;
}

const NAV_ITEMS = [
  { icon: <HomeIcon size={20} />, label: "Home", active: true },
  { icon: <Compass size={20} />, label: "Explore" },
  { icon: <Bell size={20} />, label: "Notifications" },
  { icon: <Inbox size={20} />, label: "Inbox" },
  { icon: <Bookmark size={20} />, label: "Bookmarks" },
];

const TAGS = ["Design_System", "Architecture", "React_2026"];

export default function Home() {
  const [posts, setPosts] = useState<postData | null>();
  const [serverError, setServerError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>();
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setServerError(null);
        await refreshToken();
        const response = await getExplore();
        if (response.success) {
          setPosts(response.data);
          console.log(response);
        }
        console.log("Nothing");
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message;
          setServerError(message || "Something went wrong. Please try again.");
        } else {
          setServerError("Something went wrong. Please try again.");
        }
      }
    };
    const fetchMe = async () => {
      try {
        setServerError(null);
        const response = await getMe();
        if (response.success) {
          setUser(response.data);
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message;
          setServerError(message || "Something went wrong. Please try again.");
        } else {
          setServerError("Something went wrong. Please try again.");
        }
      }
    };
    fetchFeed();
    fetchMe();
  }, []);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-screen w-full bg-[#030303] font-body text-slate-300 selection:bg-lu-accent/30 overflow-hidden">
        {/* 1. ULTRA-SLIM NAV (Icon Only) */}
        <aside className="flex w-18 flex-col items-center border-r border-white/4 py-6 bg-[#050505]">
          <div className="mb-10 h-8 w-8 rounded-xl bg-lu-accent flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.4)]">
            <span className="text-white font-display font-black text-xs">
              L
            </span>
          </div>

          <nav className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
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

        {/* 2. SECONDARY WORKSPACE NAV */}
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
                {TAGS.map((tag) => (
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

          {/* User Card - Bottom */}
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

        {/* 3. MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Top Header Bar */}
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

          {/* Post Composition */}
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

          {/* Error */}
          {serverError && (
            <div className="max-w-3xl mx-auto mt-6 px-6">
              <div className="rounded-lg bg-lu-pink/10 border border-lu-pink/20 px-4 py-3 text-sm text-lu-pink">
                {serverError}
              </div>
            </div>
          )}

          {/* FEED SECTION */}
          <div className="max-w-3xl mx-auto py-8 px-6">
            {posts && <PostCard data={posts.posts} />}
          </div>
        </main>

        {/* 4. RIGHT UTILITY */}
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
      </div>
    </TooltipProvider>
  );
}
