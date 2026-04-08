import { 
  ArrowLeft, MoreHorizontal, Heart, MessageSquare, 
  Repeat, Share, Image as ImageIcon, Smile, SendHorizonal 
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useEffect, useState } from "react";
import { getPostById } from "../../api/posts.api";
import type { DetailedPost } from "../../api/posts.api";

type PostCardDetailsProps = {
  id : string;
}

export default function PostDetail({id} : PostCardDetailsProps) {

  const [post,setPosts] = useState<DetailedPost>();

  useEffect(()=> { 
    const fetchPost = async(id : string) => {
      const response = await getPostById(id);
      setPosts(response.data)
    } 
    fetchPost(id);
  },[])

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen w-full bg-[#030303] font-body text-slate-300 selection:bg-lu-accent/30 overflow-hidden">
        <main className="flex-1 flex flex-col max-w-3xl mx-auto border-x border-white/[0.04] bg-[#050505]/30">
          
          {/* HEADER */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.04] sticky top-0 bg-[#030303]/80 backdrop-blur-xl z-50">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
                <ArrowLeft size={20} />
              </Button>
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Transmission Thread</h2>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white rounded-xl">
              <MoreHorizontal size={20} />
            </Button>
          </header>

          <ScrollArea className="flex-1">
            {/* PARENT POST */}
            <div className="p-8 pb-4">
              <div className="flex gap-5">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-12 w-12 rounded-2xl border border-white/[0.08] shadow-2xl">
                    <AvatarFallback className="bg-gradient-to-br from-lu-accent to-lu-pink text-white text-xs font-black">AN</AvatarFallback>
                  </Avatar>
                  {/* Thread connector line */}
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-white/[0.08] to-transparent rounded-full" />
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

                  <div className="inline-flex items-center mt-6 px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.04]">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                      11:13 AM • Apr 1, 2026 • <span className="text-lu-accent">Global Network</span>
                    </p>
                  </div>

                  <Separator className="my-6 bg-white/[0.04]" />

                  {/* STATS SECTION */}
                  <div className="flex gap-8 px-1">
                    <div className="group cursor-pointer">
                      <span className="text-sm font-bold text-white group-hover:text-lu-accent transition-colors">{post.likeCount}</span>
                      <span className="ml-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest group-hover:text-slate-400 transition-colors">Signals</span>
                    </div>
                    <div className="group cursor-pointer">
                      <span className="text-sm font-bold text-white group-hover:text-lu-accent transition-colors">{post.commentCount}</span>
                      <span className="ml-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest group-hover:text-slate-400 transition-colors">Responses</span>
                    </div>
                  </div>

                  <Separator className="my-6 bg-white/[0.04]" />

                  {/* ACTION BAR */}
                  <div className="flex justify-between max-w-sm px-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-slate-500 hover:text-lu-accent transition-all hover:scale-110"><MessageSquare size={20} /></button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">Reply</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-slate-500 hover:text-teal-400 transition-all hover:scale-110"><Repeat size={20} /></button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">Repost</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-slate-500 hover:text-pink-500 transition-all hover:scale-110"><Heart size={20} /></button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">Signal</TooltipContent>
                    </Tooltip>

                    <button className="text-slate-500 hover:text-white transition-all hover:scale-110"><Share size={20} /></button>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            {/* REPLY INPUT */}
            <div className="p-8 bg-white/[0.01]">
              <div className="flex gap-5">
                <Avatar className="h-10 w-10 rounded-xl border border-white/[0.05] shadow-lg">
                  <AvatarFallback className="bg-slate-800 text-[10px] font-bold text-slate-400">ME</AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 focus-within:border-lu-accent/30 transition-all">
                  <Textarea 
                    placeholder="Draft your signal response..." 
                    className="bg-transparent border-none text-[15px] p-0 focus-visible:ring-0 resize-none min-h-[60px] placeholder:text-slate-700"
                  />
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-4 text-slate-500">
                      <button className="hover:text-lu-accent transition-colors"><ImageIcon size={18} /></button>
                      <button className="hover:text-lu-accent transition-colors"><Smile size={18} /></button>
                    </div>
                    <Button size="sm" className="bg-white text-black hover:bg-slate-200 font-bold text-[10px] uppercase tracking-widest px-6 rounded-xl h-9">
                      Post Signal <SendHorizonal size={14} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* COMMENTS SECTION */}
            <div className="divide-y divide-white/[0.04]">
              {post.comments.map((comment, i) => (
                <div key={i} className="p-8 transition-colors hover:bg-white/[0.01] group">
                  <div className="flex gap-5">
                    <Avatar className="h-10 w-10 rounded-xl border border-white/[0.05]">
                      <AvatarFallback className="bg-slate-900 text-[10px] font-bold text-slate-600">AN</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold text-white hover:text-lu-accent transition-colors cursor-pointer">{comment.user.displayName}</span>
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">@{comment.user.username} • 9m</span>
                        </div>
                        <button className="text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal size={14} /></button>
                      </div>
                      <p className="text-[15px] leading-[1.6] text-slate-400 font-medium">
                        {comment.content}
                      </p>
                      <div className="flex gap-8 pt-4">
                         <button className="flex items-center gap-2 text-slate-600 hover:text-pink-500 transition-colors text-[11px] font-bold"><Heart size={16} /> 0</button>
                         <button className="flex items-center gap-2 text-slate-600 hover:text-lu-accent transition-colors text-[11px] font-bold"><MessageSquare size={16} /> Reply</button>
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