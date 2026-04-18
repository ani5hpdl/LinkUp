import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "./Avatar";
import NotificationBell from "../notifications/NotificationBell";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      className="lu-navbar sticky top-0 z-50 bg-[rgba(11,13,18,0.72)] backdrop-blur-xl border-b border-[var(--lu-border)] h-16 px-5 flex items-center justify-between"
    >
      <Link
        to="/"
        aria-label="LinkUp home"
        className="lu-brand-mark no-underline text-2xl"
      >
        LinkUp
      </Link>

      <div className="flex items-center gap-2.5">
        <button
          onClick={() => navigate("/search")}
          aria-label="Search"
          className="lu-btn p-[8px_14px] text-sm bg-[rgba(255,255,255,0.03)] border border-[var(--lu-border)] text-[var(--lu-muted)]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          Search
        </button>

        <NotificationBell />

        {user && (
          <Link to={`/profile/${user.username}`}>
            <Avatar user={user} size={30} />
          </Link>
        )}
      </div>
    </header>
  );
}
