import { Link } from "react-router-dom";
import Avatar from "../common/Avatar";
import { useDeleteComment } from "../../hooks/usePosts";
import { formatDate } from "../../utils/formatDate";

export default function CommentList({ comments = [], postId, currentUserId }) {
  const { onDeleteComment } = useDeleteComment(postId);

  if (!comments.length) {
    return (
      <p style={{ fontSize: 13, color: "var(--lu-muted)", textAlign: "center", padding: "1.5rem 0" }}>
        No comments yet. Be the first!
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {comments.map((c) => {
        const author = c.author ?? c.user ?? {};
        const commentId = c._id ?? c.id;
        const isOwner = currentUserId && (author._id === currentUserId || author.id === currentUserId);

        return (
          <div
            key={commentId}
            style={{
              display: "flex", gap: 10, padding: "10px 0",
              borderBottom: "0.5px solid var(--lu-border)",
            }}
          >
            <Link to={`/profile/${author.username}`}>
              <Avatar user={author} size={30} />
            </Link>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <Link
                  to={`/profile/${author.username}`}
                  style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 12, color: "var(--lu-text)", textDecoration: "none" }}
                >
                  {author.displayName}
                </Link>
                <span style={{ fontSize: 11, color: "var(--lu-muted)" }}>@{author.username}</span>
                <span style={{ fontSize: 11, color: "var(--lu-muted)", marginLeft: "auto" }}>{formatDate(c.createdAt)}</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--lu-muted2)", fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
                {c.content}
              </p>
              {isOwner && (
                <button
                  aria-label="Delete comment"
                  onClick={async () => {
                    if (!confirm("Delete comment?")) return;
                    try {
                      await onDeleteComment(commentId);
                    } catch {
                      // Error toast is handled in the hook.
                    }
                  }}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 11, color: "var(--lu-pink)", marginTop: 4, padding: 0,
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
