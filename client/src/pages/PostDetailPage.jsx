import { useParams, Link } from "react-router-dom";
import PageLayout from "../components/common/PageLayout";
import Avatar from "../components/common/Avatar";
import PostActions from "../components/posts/PostActions";
import CommentList from "../components/posts/CommentList";
import CommentForm from "../components/posts/CommentForm";
import Spinner from "../components/common/Spinner";
import PageHeader from "../components/common/PageHeader";
import { usePost } from "../hooks/usePosts";
import { useAuth } from "../hooks/useAuth";
import { formatDate } from "../utils/formatDate";

export default function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data, isLoading, isError } = usePost(id);

  const post = data?.data ?? data;

  return (
    <PageLayout>
      <div style={{ marginBottom: 14 }}>
        <Link
          to="/"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--lu-muted)", textDecoration: "none" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
      </div>

      {isLoading ? (
        <div className="lu-empty-state">
          <Spinner size={28} />
        </div>
      ) : isError || !post ? (
        <div className="lu-empty-state">
          <h2>Post not found</h2>
          <p>It may have been deleted or you do not have access to it.</p>
        </div>
      ) : (
        <>
          <div className="lu-card lu-page-card" style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
              <Link to={`/profile/${post.author?.username}`}>
                <Avatar user={post.author} size={40} />
              </Link>
              <div>
                <Link
                  to={`/profile/${post.author?.username}`}
                  style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 14, color: "var(--lu-text)", textDecoration: "none", display: "block" }}
                >
                  {post.author?.displayName}
                </Link>
                <span style={{ fontSize: 12, color: "var(--lu-muted)" }}>@{post.author?.username}</span>
              </div>
              <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--lu-muted)" }}>
                {formatDate(post.createdAt)}
              </span>
            </div>

            <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--lu-text)", fontWeight: 400, marginBottom: 16, wordBreak: "break-word" }}>
              {post.content}
            </p>

            <PostActions post={post} currentUserId={user?._id ?? user?.id} />
          </div>

          <div className="lu-card lu-page-card" style={{ marginBottom: "1rem" }}>
            <CommentForm postId={post._id ?? post.id} />
          </div>

          <div className="lu-card lu-page-card">
            <PageHeader
              eyebrow="Conversation"
              title={`Comments (${post.comments?.length ?? 0})`}
              subtitle="Reply to the post and keep the conversation moving."
            />
            <CommentList
              comments={post.comments ?? []}
              postId={post._id ?? post.id}
              currentUserId={user?._id ?? user?.id}
            />
          </div>
        </>
      )}
    </PageLayout>
  );
}
