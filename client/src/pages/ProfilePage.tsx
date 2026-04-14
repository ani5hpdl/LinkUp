import { 
  ArrowLeft, Edit3, Link as LinkIcon, Calendar, 
  MapPin, Settings, Share2, Image as ImageIcon,
  Heart
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ScrollArea } from "../components/ui/scroll-area";
import { useParams } from "react-router-dom";

export default function Profile() {
  // Static data mapped exactly to your Prisma 'User' & 'Post' models
  const user = {
    displayName: "Anish Poudel", // displayName String?
    username: "ani5hpdl",        // username String @unique
    bio: "Full-stack Architect | Scrum Master. Building the Stride ecosystem and LinkUp.", // bio String?
    avatarUrl: null,             // avatarUrl String?
    location: "Kathmandu, NP",   // Custom field for UI
    createdAt: "2026-04-01",     // createdAt DateTime
    _count: {
      posts: 124,                // posts Post[]
      following: 892,            // following Follow[]
      followers: 1205            // followers Follow[]
    }
  };

  const mockPosts = [
    {
      id: "1",
      content: "Just updated the Prisma schema for LinkUp. Optimized the notification indexes for faster unread counts. ⚡",
      imageUrl: null, // imageUrl String?
      likeCount: 42,  // likeCount Int
      commentCount: 5, // commentCount Int
      createdAt: "2026-04-13T10:00:00Z"
    }
  ];

  const {id} = useParams();
  if(id){

  }else{
    
  }

  return (
    <div className="flex h-screen w-full bg-[#030303] font-body text-slate-300 selection:bg-lu-accent/30 overflow-hidden">
      <main className="flex-1 flex flex-col max-w-4xl mx-auto border-x border-white/[0.04] bg-[#050505]/20">
        
        {/* TOP NAVIGATION */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.04] sticky top-0 bg-[#030303]/80 backdrop-blur-xl z-50">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/5 transition-all">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h2 className="text-[13px] font-black uppercase tracking-widest text-white leading-none">
                {user.displayName || user.username}
              </h2>
              <p className="text-[10px] font-bold text-slate-600 uppercase mt-1 tracking-tighter">
                {user._count.posts} Signals in Database
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white rounded-xl hover:bg-white/5"><Share2 size={18} /></Button>
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white rounded-xl hover:bg-white/5"><Settings size={18} /></Button>
          </div>
        </header>

        <ScrollArea className="flex-1">
          {/* PROFILE VISUALS */}
          <div className="relative">
            <div className="h-44 w-full bg-gradient-to-br from-lu-accent/15 via-slate-900 to-[#030303] border-b border-white/[0.04]" />
            <div className="absolute -bottom-16 left-8">
              <Avatar className="h-32 w-32 rounded-[2.5rem] border-4 border-[#030303] shadow-2xl ring-1 ring-white/[0.1]">
                <AvatarImage src={user.avatarUrl ?? ""} />
                <AvatarFallback className="bg-gradient-to-tr from-lu-accent to-lu-pink text-white text-3xl font-black">
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute -bottom-14 right-8">
              <Button className="bg-white text-black hover:bg-slate-200 font-bold text-[11px] uppercase tracking-widest px-6 rounded-xl h-10 transition-transform active:scale-95">
                <Edit3 size={14} className="mr-2" /> Edit Profile
              </Button>
            </div>
          </div>

          {/* IDENTITY & BIO */}
          <div className="mt-20 px-8 pb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-white tracking-tighter">{user.displayName}</h1>
              <Badge variant="outline" className="h-5 px-2 text-[9px] font-black uppercase border-lu-accent/30 text-lu-accent bg-lu-accent/5">
                Developer Node
              </Badge>
            </div>
            <p className="text-[12px] font-bold text-slate-600 uppercase tracking-widest mt-1">@{user.username}</p>
            
            <p className="mt-6 text-[15px] text-slate-300 leading-relaxed max-w-xl font-medium">
              {user.bio || "No transmission data available for this user bio."}
            </p>

            <div className="flex flex-wrap gap-6 mt-6">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <MapPin size={14} className="text-lu-accent" /> {user.location}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <Calendar size={14} className="text-lu-accent" /> Joined {user.createdAt}
              </div>
            </div>

            {/* METRICS GRID (Derived from Prisma Relations) */}
            <div className="grid grid-cols-3 gap-4 mt-8">
               {[
                 { label: "Following", value: user._count.following },
                 { label: "Followers", value: user._count.followers },
                 { label: "Post Count", value: user._count.posts }
               ].map((stat) => (
                 <div key={stat.label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] group hover:border-white/[0.1] transition-all cursor-crosshair">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                    <p className="text-xl font-black text-white group-hover:text-lu-accent transition-colors tabular-nums">{stat.value}</p>
                 </div>
               ))}
            </div>
          </div>

          {/* CONTENT FEED TABS */}
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full justify-start h-14 bg-transparent border-b border-white/[0.04] rounded-none px-8 gap-8">
              <TabsTrigger value="posts" className="data-[state=active]:bg-transparent data-[state=active]:text-lu-accent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-lu-accent rounded-none h-full px-0 text-[11px] font-black uppercase tracking-widest">
                Signals
              </TabsTrigger>
              <TabsTrigger value="replies" className="data-[state=active]:bg-transparent data-[state=active]:text-lu-accent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-lu-accent rounded-none h-full px-0 text-[11px] font-black uppercase tracking-widest">
                Comments
              </TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-transparent data-[state=active]:text-lu-accent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-lu-accent rounded-none h-full px-0 text-[11px] font-black uppercase tracking-widest">
                Media
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="p-0">
               <div className="divide-y divide-white/[0.04]">
                  {mockPosts.map((post) => (
                    <div key={post.id} className="p-8 hover:bg-white/[0.01] transition-colors group cursor-pointer">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <p className="text-[14px] text-slate-300 leading-relaxed mb-4">{post.content}</p>
                          {post.imageUrl && (
                            <div className="mb-4 rounded-2xl border border-white/5 overflow-hidden">
                              <img src={post.imageUrl} alt="post" className="w-full h-auto" />
                            </div>
                          )}
                          <div className="flex gap-6">
                            <span className="flex items-center gap-2 text-[11px] font-bold text-slate-600 group-hover:text-lu-pink transition-colors">
                              <Heart size={14} /> {post.likeCount}
                            </span>
                            <span className="flex items-center gap-2 text-[11px] font-bold text-slate-600 group-hover:text-lu-accent transition-colors">
                              <ImageIcon size={14} /> {post.commentCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </main>
    </div>
  );
}