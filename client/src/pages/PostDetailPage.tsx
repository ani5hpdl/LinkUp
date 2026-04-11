import { useParams } from "react-router-dom";
import { TooltipProvider } from "../components/ui/tooltip";
import { HomeIcon, Compass, Bell, Inbox, Bookmark } from "lucide-react";
import { NavRail, type NavItem } from "../components/home/NavRail";
import { RightSidebar } from "../components/home/RightSidebar";
import { WorkspaceSidebar } from "../components/home/WorkspaceSidebar";
import { HeaderBar } from "../components/home/HeaderBar";
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
  const { id } = useParams<{ id: string }>();

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-screen w-full bg-[#030303] font-body text-slate-300 selection:bg-lu-accent/30 overflow-hidden">
        <NavRail items={NAV_ITEMS} />
        {/* Note: user state would ideally come from an Auth Context here */}
        <WorkspaceSidebar tags={TAGS} user={null} />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <HeaderBar />
          {id ? (
            <PostDetail postId={id} />
          ) : (
            <div className="p-8 text-center text-rose-500 font-bold uppercase tracking-widest">
              Oops! No Signal ID found bbg!!
            </div>
          )}
        </main>

        <RightSidebar />
      </div>
    </TooltipProvider>
  );
};

export default PostDetailPage;