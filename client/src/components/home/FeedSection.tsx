import { useState } from "react";
import type { Post } from "../../api/posts.api";
import { PostCard } from "../posts/PostCard";
import { useNavigate } from "react-router-dom";

interface FeedSectionProps {
  posts: Post[] | undefined;
}

export function FeedSection({ posts }: FeedSectionProps) {

  const navigate = useNavigate();
  const handlePostClick = (id: string) => {
    navigate(`/post/${id}`)
  }

  if (!posts) return null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
      {posts && posts.map((post)=>(
        <PostCard post={post} onClick={handlePostClick}/>
      ))}
    </div>
  );
}
