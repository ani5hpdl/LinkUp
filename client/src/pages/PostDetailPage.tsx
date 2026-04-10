import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TooltipProvider } from "../components/ui/tooltip";
import { HomeIcon, Compass, Bell, Inbox, Bookmark } from "lucide-react";
import { ErrorBanner } from "../components/home/ErrorBanner";
import { HeaderBar } from "../components/home/HeaderBar";
import { NavRail, type NavItem } from "../components/home/NavRail";
import { RightSidebar } from "../components/home/RightSidebar";
import { WorkspaceSidebar } from "../components/home/WorkspaceSidebar";
import type { User } from "../api/auth.api";
import { getPostById, type DetailedPost, type Post } from "../api/posts.api";
import axios from "axios";
import PostDetail from "../components/posts/PostDetails";

const NAV_ITEMS: NavItem[] = [
  { icon: <HomeIcon size={20} />, label: "Home", active: true },
  { icon: <Compass size={20} />, label: "Explore" },
  { icon: <Bell size={20} />, label: "Notifications" },
  { icon: <Inbox size={20} />, label: "Inbox" },
  { icon: <Bookmark size={20} />, label: "Bookmarks" },
];

const TAGS = ["Design_System", "Architecture", "React_2026"];

const PostDetailPage = () => {
  const { id } = useParams<string>();

  const [post, setPost] = useState<DetailedPost>();
  const [user, setUser] = useState<User | null>();
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async (id: string): Promise<void> => {
      try {
        const response = await getPostById(id);
        if (response.success) {
          setPost(response.data);
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
    if (id) {
      fetchPost(id);
    } else {
      setServerError("Oops wrong way bbg!!");
    }
  }, [id]);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-screen w-full bg-[#030303] font-body text-slate-300 selection:bg-lu-accent/30 overflow-hidden">
        <NavRail items={NAV_ITEMS} />
        <WorkspaceSidebar tags={TAGS} user={user} />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <HeaderBar />

          {serverError && <ErrorBanner message={serverError} />}

          {post && <PostDetail post={post} />}
        </main>

        <RightSidebar />
      </div>
    </TooltipProvider>
  );
};

export default PostDetailPage;
