import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { Button } from "./components/ui/button";
import Login from "./pages/LoginPage.tsx";
import Signup from "./pages/RegitserPage.tsx";
import { ArrowRight, Sparkles, ShieldCheck, Users2 } from "lucide-react";
import Home from "./pages/HomePage.tsx";
import Test from "./pages/Test.tsx";
import PostDetail from "./components/posts/PostDetails.tsx";
import PostDetailPage from "./pages/PostDetailPage.tsx";

const Landing = () => (
  <div className="relative min-h-screen w-full overflow-hidden bg-void font-body selection:bg-lu-accent/30">
    {/* Background Glows to match Signup/Login */}
    <div className="absolute -top-24 -left-24 h-[500px] w-[500px] rounded-full bg-lu-accent/10 blur-[120px]" />
    <div className="absolute top-1/2 -right-24 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-teal/5 blur-[100px]" />

    <div className="relative z-10 flex flex-col gap-20 px-6 py-20 md:px-10 lg:px-24">
      
      {/* HERO SECTION */}
      <div className="max-w-4xl space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-teal animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-frost">
            Network Architecture v2.0
          </p>
        </div>

        <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-7xl lg:text-8xl">
          Your social layer <br />
          for <span className="text-muted2">modern teams.</span>
        </h1>

        <p className="max-w-2xl text-lg font-medium leading-relaxed text-muted2 md:text-xl">
          Build your profile, share your story, and connect with the people who
          move your work forward. A minimalist network for high-signal thinkers.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Button asChild className="h-14 rounded-2xl bg-lu-accent px-8 text-base font-bold text-white shadow-lg shadow-lu-accent/20 transition-all hover:bg-lu-accent/90 hover:scale-[1.02] active:scale-[0.98]">
            <NavLink to="/signup" className="flex items-center gap-2">
              Get Started <ArrowRight size={18} />
            </NavLink>
          </Button>
          
          <Button
            asChild
            variant="ghost"
            className="h-14 rounded-2xl border border-white/5 bg-white/[0.03] px-8 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/[0.08]"
          >
            <NavLink to="/login">Sign In</NavLink>
          </Button>

          <div className="flex items-center gap-2 ml-2">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-void bg-muted2" />
                ))}
             </div>
             <span className="text-[11px] font-bold uppercase tracking-widest text-muted">
               Join 2k+ creators
             </span>
          </div>
        </div>
      </div>

      {/* FEATURE GRID */}
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Profile",
            desc: "Craft a rich identity with bio, socials, and spotlight cards.",
            icon: <Sparkles className="text-lu-accent" size={20} />,
            color: "text-lu-accent"
          },
          {
            title: "Collaboration",
            desc: "Send invites, follow people, and stay in sync with updates.",
            icon: <Users2 className="text-teal" size={20} />,
            color: "text-teal"
          },
          {
            title: "Trust",
            desc: "Secure auth and privacy-first defaults built into the core.",
            icon: <ShieldCheck className="text-pink" size={20} />,
            color: "text-pink"
          }
        ].map((feature, index) => (
          <div
            key={feature.title}
            className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-md transition-all hover:bg-white/[0.04]"
          >
            {/* Subtle hover glow */}
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/5 blur-2xl transition-all group-hover:bg-white/10" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 shadow-inner">
                {feature.icon}
              </div>
              
              <div>
                <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${feature.color}`}>
                  Feature 0{index + 1}
                </p>
                <h3 className="font-display mt-2 text-2xl font-bold text-white tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-muted2">
                  {feature.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER NOTE */}
      <div className="flex items-center justify-between border-t border-white/5 pt-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted">
          © 2026 LinkUp Labs
        </p>
        <div className="h-1 w-1 rounded-full bg-muted" />
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted">
          Built for the modern web
        </p>
      </div>
    </div>
  </div>
);


function App() {
  return (
    <div>
      {/* <header className="sticky top-0 z-10 border-b border-white/5 bg-void/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-accent to-pink shadow-lg shadow-accent/40" />
            <div>
              <p className="text-sm font-semibold text-teal">LinkUp</p>
              <p className="text-xs text-slate-400">Connect. Share. Grow.</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
            <NavLink to="/signup" className={navLinkClass}>
              Sign Up
            </NavLink>
          </nav>
        </div>
      </header> */}

      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/test" element={<Test />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
