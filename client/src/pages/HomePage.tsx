import { Home as HomeIcon, Compass, Bell, Inbox, Bookmark } from "lucide-react";
import { TooltipProvider } from "../components/ui/tooltip";
import { useEffect, useState } from "react";
import { getExplore, type Post } from "../api/posts.api";
import { getMe, refreshToken } from "../api/auth.api";
import type { User } from "../api/auth.api";
import axios from "axios";
import { NavRail, type NavItem } from "../components/home/NavRail";
import { WorkspaceSidebar } from "../components/home/WorkspaceSidebar";
import { HeaderBar } from "../components/home/HeaderBar";
import { PostComposer } from "../components/home/PostComposer";
import { ErrorBanner } from "../components/home/ErrorBanner";
import { FeedSection } from "../components/home/FeedSection";
import { RightSidebar } from "../components/home/RightSidebar";

export interface postData {
  posts: Post[];
  count: number;
}

const NAV_ITEMS: NavItem[] = [
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
        <NavRail items={NAV_ITEMS} />
        <WorkspaceSidebar tags={TAGS} user={user} />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <HeaderBar />

          <PostComposer user={user} />

          {serverError && <ErrorBanner message={serverError} />}

          <FeedSection posts={posts?.posts} />
        </main>

        <RightSidebar />
      </div>
    </TooltipProvider>
  );
}
