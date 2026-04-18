const GRADIENTS = ["av-violet", "av-teal", "av-pink", "av-orange", "av-blue"];

/** Picks a gradient class deterministically from the username */
const getGradient = (username = "") => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) hash = username.charCodeAt(i) + ((hash << 5) - hash);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
};

/**
 * Avatar — shows the user's profile picture or a gradient initial.
 * Props:
 *  - user: { username, displayName, avatarUrl }
 *  - size: number (px, default 36)
 *  - className: extra class
 */
export default function Avatar({ user, size = 36, className = "" }) {
  const initials = (user?.displayName || user?.username || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const gradientClass = getGradient(user?.username);
  const fontSize = Math.round(size * 0.36);

  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.username}
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      />
    );
  }

  return (
    <div
      className={`${gradientClass} ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Syne, sans-serif",
        fontWeight: 800,
        fontSize,
        flexShrink: 0,
        userSelect: "none",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.22)",
      }}
    >
      {initials}
    </div>
  );
}
