import type { Post } from "../../api/posts.api";
import { PostCard } from "../posts/PostCard";

interface FeedSectionProps {
  posts: Post[] | undefined;
}

export function FeedSection({ posts }: FeedSectionProps) {
  if (!posts) return null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
      <PostCard data={posts} />
    </div>
  );
}
