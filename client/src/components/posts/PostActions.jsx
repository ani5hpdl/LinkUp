import { useState } from "react";
import { Link } from "react-router-dom";
import { useToggleLike, useDeletePost } from "../../hooks/usePosts";
import Modal from "../common/Modal";
import PostForm from "./PostForm";
import { toastAction, toastError } from "../../lib/toast";

export default function PostActions({ post, currentUserId }) {
  const { toggleLike, isLoading: liking } = useToggleLike();
  const { onDelete } = useDeletePost();
  const [editOpen, setEditOpen] = useState(false);

  const postId = post._id || post.id;
  const isLiked = post.likes?.includes(currentUserId);
  const likeCount = post.likes?.length ?? post.likeCount ?? 0;
  const commentCount = post.comments?.length ?? post.commentCount ?? 0;
  const isOwner = currentUserId && (post.author?._id === currentUserId || post.author?.id === currentUserId || post.userId === currentUserId);

  const actionBtn = (active, color) => ({
    display: "flex", alignItems: "center", gap: 5,
    fontSize: 12, color: active ? color : "var(--lu-muted)",
    cursor: "pointer", background: "none", border: "none",
    padding: 0, fontFamily: "DM Sans, sans-serif", fontWeight: 400,
    transition: "color 0.15s",
  });

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Like */}
        <button
          aria-label={isLiked ? "Unlike post" : "Like post"}
          style={actionBtn(isLiked, "var(--lu-pink)")}
          onClick={async () => {
            if (liking) return;
            try {
              await toggleLike(postId);
              toastAction.saved(isLiked ? "Like removed." : "Liked.");
            } catch {
              // Error toast is handled in the hook.
            }
          }}
          disabled={liking}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {likeCount}
        </button>

        {/* Comment */}
        <Link to={`/post/${postId}`} style={{ ...actionBtn(false, "var(--lu-teal)"), textDecoration: "none" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {commentCount}
        </Link>

        {/* Share */}
        <button
          aria-label="Copy post link"
          style={actionBtn(false)}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
              toastAction.copied();
            } catch {
              toastError("Could not copy the link.");
            }
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>

        {/* Owner actions */}
        {isOwner && (
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button style={{ ...actionBtn(false), fontSize: 11 }} onClick={() => setEditOpen(true)}>
              Edit
            </button>
            <button
              aria-label="Delete post"
              style={{ ...actionBtn(false), color: "var(--lu-pink)", fontSize: 11 }}
              onClick={async () => {
                if (!confirm("Delete this post?")) return;
                try {
                  await onDelete(postId);
                } catch {
                  // Error toast is handled in the hook.
                }
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Edit modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit post">
        <PostForm postId={postId} defaultContent={post.content} onSuccess={() => setEditOpen(false)} />
      </Modal>
    </>
  );
}
