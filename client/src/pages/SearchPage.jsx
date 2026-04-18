import { useState } from "react";
import PageLayout from "../components/common/PageLayout";
import PageHeader from "../components/common/PageHeader";
import UserList from "../components/users/UserList";
import PostCard from "../components/posts/PostCard";
import { useSearchUsers, useSearchPosts } from "../hooks/useSearch";
import { useAuth } from "../hooks/useAuth";

export default function SearchPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("users");

  const { data: usersData, isLoading: usersLoading } = useSearchUsers(query);
  const { data: postsData, isLoading: postsLoading } = useSearchPosts(query);

  const users = usersData?.data ?? usersData ?? [];
  const posts = postsData?.data?.posts ?? postsData?.data ?? postsData ?? [];

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Find"
        title="Search"
        subtitle="Search people and posts across the app."
      />

      <div style={{ marginBottom: "1rem" }}>
        <div style={{ position: "relative" }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--lu-muted)",
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="lu-input"
            placeholder="Search people or posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ paddingLeft: 34 }}
            autoFocus
          />
        </div>
      </div>

      <div className="lu-tabbar">
        <button type="button" className={`lu-tab ${tab === "users" ? "is-active" : ""}`} onClick={() => setTab("users")}>
          People
        </button>
        <button type="button" className={`lu-tab ${tab === "posts" ? "is-active" : ""}`} onClick={() => setTab("posts")}>
          Posts
        </button>
      </div>

      {query.trim().length < 2 ? (
        <div className="lu-empty-state">
          <h2>Start typing</h2>
          <p>Enter at least 2 characters to search people or posts.</p>
        </div>
      ) : tab === "users" ? (
        <UserList
          users={users}
          isLoading={usersLoading}
          emptyMessage="No users found."
          currentUsername={user?.username}
        />
      ) : (
        <div className="lu-page">
          {postsLoading ? (
            <div className="lu-empty-state">
              <p>Searching...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="lu-empty-state">
              <h2>No posts found</h2>
              <p>Try a different keyword or search people instead.</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id ?? post.id} post={post} currentUserId={user?._id ?? user?.id} />
            ))
          )}
        </div>
      )}
    </PageLayout>
  );
}
