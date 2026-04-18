import { NavLink } from "react-router-dom";
import { useAuth, useLogout } from "../../hooks/useAuth";
import Avatar from "./Avatar";

const navItems = [
  {
    to: "/",
    label: "Home",
    end: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    to: "/explore",
    label: "Explore",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    to: "/notifications",
    label: "Notifications",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    to: null,
    label: "Profile",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

const activeStyle = {
  background: "linear-gradient(135deg, rgba(124,92,255,0.16), rgba(45,212,191,0.08))",
  color: "var(--lu-accent2)",
  fontWeight: 500,
  border: "1px solid rgba(124,92,255,0.22)",
};
const baseStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 12px",
  borderRadius: 12,
  fontSize: 13,
  color: "var(--lu-muted2)",
  cursor: "pointer",
  marginBottom: 4,
  fontWeight: 400,
  textDecoration: "none",
  transition: "color var(--lu-transition), background var(--lu-transition), border-color var(--lu-transition)",
};

export default function Sidebar() {
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <aside
      className="lu-sidebar"
      style={{
        width: 234,
        flexShrink: 0,
        background: "rgba(17,21,29,0.92)",
        border: "1px solid var(--lu-border)",
        borderRadius: 18,
        padding: "0.9rem",
        display: "flex",
        flexDirection: "column",
        height: "fit-content",
        position: "sticky",
        top: 72,
        boxShadow: "var(--lu-shadow-soft)",
        backdropFilter: "blur(10px)",
      }}
    >
      {navItems.map((item) => {
        if (item.to === null) {
          return (
            <NavLink
              key={item.label}
              to={user ? `/profile/${user.username}` : "/"}
              style={({ isActive }) => ({ ...baseStyle, ...(isActive ? activeStyle : {}) })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          );
        }
        return (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            style={({ isActive }) => ({ ...baseStyle, ...(isActive ? activeStyle : {}) })}
          >
            {item.icon}
            {item.label}
          </NavLink>
        );
      })}

      {user && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 10px 4px",
            borderTop: "1px solid var(--lu-border)",
            marginTop: 8,
            borderRadius: 16,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <Avatar user={user} size={28} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--lu-text)", fontFamily: "Syne, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.displayName}
            </div>
            <div style={{ fontSize: 11, color: "var(--lu-muted)" }}>@{user.username}</div>
          </div>
          <button
            onClick={() => logout.mutate()}
            title="Log out"
            aria-label="Log out"
            className="lu-btn lu-btn-icon lu-btn-ghost"
            style={{ color: "var(--lu-muted)", background: "transparent", border: "none" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      )}
    </aside>
  );
}
