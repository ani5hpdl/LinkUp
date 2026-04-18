import { Link } from "react-router-dom";
import Avatar from "../common/Avatar";
import FollowButton from "./FollowButton";

export default function UserCard({ user, currentUsername }) {
  const isMe = currentUsername === user?.username;

  return (
    <div
      className="lu-card"
      style={{
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        transition: "transform var(--lu-transition), border-color var(--lu-transition)",
      }}
    >
      <Link to={`/profile/${user.username}`}>
        <Avatar user={user} size={40} />
      </Link>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link
          to={`/profile/${user.username}`}
          style={{ textDecoration: "none", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14, color: "var(--lu-text)", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {user.displayName}
        </Link>
        <span className="lu-note">@{user.username}</span>
        {user.bio && (
          <p style={{ fontSize: 12, color: "var(--lu-muted2)", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user.bio}
          </p>
        )}
      </div>
      {!isMe && <FollowButton username={user.username} isFollowing={user.isFollowing} />}
    </div>
  );
}
