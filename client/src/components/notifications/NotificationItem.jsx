import { Link } from "react-router-dom";
import Avatar from "../common/Avatar";
import { formatDate } from "../../utils/formatDate";

const iconMap = {
  like: { emoji: "❤️", bg: "var(--lu-pink-glow)" },
  follow: { emoji: "👤", bg: "var(--lu-accent-glow)" },
  comment: { emoji: "💬", bg: "var(--lu-teal-glow)" },
};

export default function NotificationItem({ notif, onRead }) {
  const kind = iconMap[notif.type] ?? { emoji: "🔔", bg: "var(--lu-surface2)" };
  const actor = notif.actor ?? notif.from ?? notif.sender ?? null;
  const hasActor = !!actor?.username;
  const isUnread = !(notif.isRead ?? notif.read);
  const notifId = notif._id ?? notif.id;

  return (
    <div
      role={isUnread ? "button" : undefined}
      tabIndex={isUnread ? 0 : -1}
      aria-label={isUnread ? "Mark notification as read" : "Notification"}
      onClick={() => isUnread && onRead?.(notifId)}
      onKeyDown={(e) => {
        if (!isUnread) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onRead?.(notifId);
        }
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        background: isUnread ? "rgba(124,92,255,0.06)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${isUnread ? "var(--lu-border2)" : "var(--lu-border)"}`,
        borderRadius: 14,
        cursor: isUnread ? "pointer" : "default",
        transition: "background var(--lu-transition), border-color var(--lu-transition), transform var(--lu-transition)",
        textAlign: "left",
        width: "100%",
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: kind.bg,
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        <span aria-hidden="true">{kind.emoji}</span>
      </div>

      {hasActor ? (
        <Link to={`/profile/${actor.username}`} style={{ textDecoration: "none" }} onClick={(e) => e.stopPropagation()}>
          <Avatar user={actor} size={28} />
        </Link>
      ) : (
        <Avatar user={{ username: "?" }} size={28} />
      )}

      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, color: "var(--lu-text)", fontWeight: 400, margin: 0, lineHeight: 1.5 }}>
          {hasActor ? (
            <Link to={`/profile/${actor.username}`} style={{ fontWeight: 500, color: "var(--lu-text)", textDecoration: "none" }}>
              {actor.displayName ?? actor.username}
            </Link>
          ) : (
            <span style={{ fontWeight: 500, color: "var(--lu-text)" }}>Someone</span>
          )}{" "}
          <span style={{ color: "var(--lu-muted2)" }}>{notif.message ?? notif.body}</span>
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {isUnread && (
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--lu-accent)", display: "inline-block" }} />
        )}
        <span style={{ fontSize: 11, color: "var(--lu-muted)" }}>{formatDate(notif.createdAt)}</span>
      </div>
    </div>
  );
}
