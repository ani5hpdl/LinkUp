import { Link } from "react-router-dom";
import Avatar from "../common/Avatar";
import PostActions from "./PostActions";
import { formatDate } from "../../utils/formatDate";

export default function PostCard({ post, currentUserId }) {
  if (!post) return null;
  const author = post.author ?? post.user ?? {};

  return (
    <article
      className="lu-card p-4 transition-all hover:-translate-y-px hover:border-[var(--lu-border2)] cursor-default group"
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--lu-border2)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--lu-border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <Link to={`/profile/${author.username}`} className="no-underline">
          <Avatar user={author} size={36} />
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            to={`/profile/${author.username}`}
            className="no-underline block font-syne font-bold text-sm text-[var(--lu-text)]"
          >
            {author.displayName}
          </Link>
          <span className="lu-note">@{author.username}</span>
        </div>
        <span className="text-xs text-[var(--lu-muted)] flex-shrink-0 whitespace-nowrap">
          {formatDate(post.createdAt)}
        </span>
      </div>

      <Link to={`/post/${post._id || post.id}`} className="no-underline">
        <p className="text-sm leading-relaxed text-[var(--lu-text)] font-normal mb-3 break-words">
          {post.content}
        </p>
      </Link>

      <PostActions post={post} currentUserId={currentUserId} />
    </article>
  );
}
