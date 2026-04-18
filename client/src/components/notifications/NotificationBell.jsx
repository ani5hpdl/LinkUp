import { Link } from "react-router-dom";
import { useUnreadCount } from "../../hooks/useNotifications";

export default function NotificationBell() {
  const { data } = useUnreadCount();
  const count = data?.count ?? 0;

  return (
    <Link
      to="/notifications"
      aria-label="Open notifications"
      style={{
        position: "relative",
        color: "var(--lu-muted)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 38,
        height: 38,
        borderRadius: 999,
        border: "1px solid var(--lu-border)",
        background: "rgba(255,255,255,0.03)",
        transition: "background var(--lu-transition), border-color var(--lu-transition), color var(--lu-transition)",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {count > 0 && (
        <span
          style={{
            position: "absolute", top: -4, right: -4,
            background: "var(--lu-accent)", color: "#fff",
            fontSize: 9, fontWeight: 700, borderRadius: "999px",
            minWidth: 14, height: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 3px",
          }}
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
