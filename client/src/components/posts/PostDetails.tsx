import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ErrorBanner } from "../home/ErrorBanner";

import { 
  getPostById, 
  createComment, 
  updateLike, 
  type DetailedPost, 
  type Users 
} from "../../api/posts.api";

type PostDetailProps = {
  postId: string;
};

export default function PostDetail({ postId }: PostDetailProps) {
  const navigate = useNavigate();
  
  // -- DATA STATE --
  const [post, setPost] = useState<DetailedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  
  // -- UI STATE --
  const [likeCount, setLikeCount] = useState<Record<string, number>>({});
  const [openLikes, setOpenLikes] = useState(false);
  const [likedUsers, setLikedUsers] = useState<Users[]>([]);
  const [loadingLikes, setLoadingLikes] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");

  // -- FETCHING LOGIC --
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await getPostById(postId);
        if (response.success) {
          setPost(response.data);
          setServerError(null);
        }
      } catch (error: unknown) {
        const message = axios.isAxiosError(error) 
          ? error.response?.data?.message 
          : "Transmission failed. Signal lost.";
        setServerError(message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const toggleLike = async (id: string): Promise<void> => {
    try {
      const response = await updateLike(id);
      if (response.success) {
        setLikeCount((prev) => ({
          ...prev,
          [id]: response.data.likeCount,
        }));
        // Update local post object if needed for the modal
        if (post) setLikedUsers(post.likes.map((l) => l.user));
      }
    } catch (error) {
      console.error("Like failed", error);
    }
  };

  const handleOpenLikes = async () => {
    if (!post) return;
    setOpenLikes(true);
    setLoadingLikes(true);
    try {
      setLikedUsers(post.likes.map((l) => l.user));
    } finally {
      setLoadingLikes(false);
    }
  };

  const submitComment = async () => {
    if (!content.trim() || !post) return;
    try {
      const response = await createComment(post.id, {content});
      if (response.success) {
        setContent("");
        // Ideally: Refetch post or manually append the comment to state here
        const updated = await getPostById(post.id);
        if (updated.success) setPost(updated.data);
      }
    } catch (error) {
      console.error("Comment creation failed", error);
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse text-xs tracking-widest">CONNECTING TO STREAM...</div>;
  if (serverError) return <ErrorBanner message={serverError} />;
  if (!post) return null;

  return (
    <div className="flex flex-col max-w-3xl mx-auto border-x border-white/4 bg-[#050505]/30 min-h-full">
      {/* HEADER */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-white/4 sticky top-0 bg-[#030303]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            size="icon"
            className="rounded-xl hover:bg-white/5 text-slate-400"
          >
            <ArrowLeft size={20} />
          </Button>
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
            Transmission Thread
          </h2>
        </div>
        <Button variant="ghost" size="icon" className="text-slate-500 rounded-xl">
          <MoreHorizontal size={20} />
        </Button>
      </header>

      {/* PARENT POST */}
      <div className="p-8 pb-4">
        <div className="flex gap-5">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-12 w-12 rounded-2xl border border-white/8 shadow-2xl">
              <AvatarImage src={post.user.avatarUrl ?? "/placeholder_avatar.png"} />
              <AvatarFallback className="bg-linear-to-br from-lu-accent to-lu-pink text-white text-xs font-black">
                {post.user.displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="w-0.5 flex-1 bg-linear-to-b from-white/8 to-transparent rounded-full" />
          </div>

          <div className="flex-1">
            <div className="flex flex-col mb-4">
              <p className="text-[16px] font-bold text-white tracking-tight leading-none">
                {post.user.displayName}
              </p>
              <p className="text-[11px] font-bold text-slate-600 mt-1.5 uppercase tracking-widest">
                @{post.user.username}
              </p>
            </div>

            <p className="text-[17px] text-slate-200 leading-[1.6] font-medium">
              {post.content}
            </p>

            {/* STATS SECTION */}
            <div className="flex gap-8 mt-6">
              <div className="group cursor-pointer" onClick={handleOpenLikes}>
                <span className="text-sm font-bold text-white group-hover:text-lu-accent transition-colors">
                  {likeCount[post.id] ?? post._count.likes}
                </span>
                <span className="ml-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  Signals
                </span>
              </div>
              <div className="group">
                <span className="text-sm font-bold text-white">
                  {post._count.comments}
                </span>
                <span className="ml-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  Responses
                </span>
              </div>
            </div>

            <Separator className="my-6 bg-white/[0.04]" />

            {/* ACTION BAR */}
            <div className="flex justify-between max-w-sm">
              <button className="text-slate-500 hover:text-lu-accent transition-all">
                <MessageSquare size={20} />
              </button>
              <button className="text-slate-500 hover:text-teal-400 transition-all">
                <Repeat size={20} />
              </button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-0 flex items-center gap-2 ${(likeCount[post.id] ?? post._count.likes) > 0 ? "text-pink-500" : "text-slate-600"} hover:bg-transparent`}
                onClick={() => toggleLike(post.id)}
              >
                <Heart size={16} className={(likeCount[post.id] ?? post._count.likes) > 0 ? "fill-pink-500" : ""} />
                <span className="tabular-nums">{likeCount[post.id] ?? post._count.likes}</span>
              </Button>
              <button className="text-slate-500 hover:text-white transition-all">
                <Share size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* REPLY INPUT */}
      <div className="p-8 bg-white/[0.01] border-y border-white/5">
        <div className="flex gap-5">
          <Avatar className="h-10 w-10 rounded-xl border border-white/[0.05]">
            <AvatarFallback className="bg-slate-800 text-[10px] font-bold text-slate-400">ME</AvatarFallback>
          </Avatar>
          <div className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4">
            <Textarea
              placeholder="Draft your signal response..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-transparent border-none text-[15px] p-0 focus-visible:ring-0 resize-none min-h-[60px]"
            />
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-4 text-slate-500">
                <ImageIcon size={18} className="cursor-pointer hover:text-white" />
                <Smile size={18} className="cursor-pointer hover:text-white" />
              </div>
              <Button
                size="sm"
                onClick={submitComment}
                className="bg-white text-black hover:bg-slate-200 font-bold text-[10px] uppercase tracking-widest px-6 rounded-xl"
              >
                Post Signal <SendHorizonal size={14} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* COMMENTS SECTION */}
      <div className="divide-y divide-white/[0.04]">
        {post.comments.map((comment) => (
          <div key={comment.id} className="p-8 hover:bg-white/[0.01] group">
            <div className="flex gap-5">
              <Avatar className="h-10 w-10 rounded-xl">
                <AvatarImage src={comment.user.avatarUrl ?? "/placeholder_avatar.png"} />
                <AvatarFallback className="bg-slate-900 text-[10px] font-bold text-slate-600">
                  {comment.user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-white">{comment.user.displayName}</span>
                    <span className="text-[10px] font-bold text-slate-600">@{comment.user.username}</span>
                  </div>
                </div>
                <p className="text-[15px] text-slate-400 font-medium">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LIKES DIALOG */}
      <Dialog open={openLikes} onOpenChange={setOpenLikes}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 text-white max-w-md">
          <DialogHeader><DialogTitle className="text-xs font-bold tracking-[0.2em] text-slate-400">SIGNALS</DialogTitle></DialogHeader>
          <div className="mt-4 space-y-4 max-h-[400px] overflow-auto">
            {loadingLikes ? (
              <p className="text-slate-500 text-sm">Loading...</p>
            ) : likedUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8"><AvatarImage src={user.avatarUrl ?? "/placeholder_avatar.png"} /></Avatar>
                <div>
                  <p className="text-sm font-bold text-white">{user.displayName}</p>
                  <p className="text-xs text-slate-500">@{user.username}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}