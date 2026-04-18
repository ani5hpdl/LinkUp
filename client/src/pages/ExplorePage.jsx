import PageLayout from "../components/common/PageLayout";
import PostCard from "../components/posts/PostCard";
import Spinner from "../components/common/Spinner";
import PageHeader from "../components/common/PageHeader";
import { useExplore } from "../hooks/usePosts";
import { useAuth } from "../hooks/useAuth";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

export default function ExplorePage() {
  const { user } = useAuth();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useExplore();
  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage);

  const posts = data?.pages.flatMap((p) => p.data?.posts ?? p.data ?? []) ?? [];

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Discovery"
        title="Explore"
        subtitle="Discover what’s happening across the network."
      />

      {isLoading ? (
        <div className="lu-empty-state">
          <Spinner size={28} />
        </div>
      ) : posts.length === 0 ? (
        <div className="lu-empty-state">
          <h2>No posts yet</h2>
          <p>Check back soon for fresh content.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {posts.map((post) => (
            <PostCard key={post._id ?? post.id} post={post} currentUserId={user?._id ?? user?.id} />
          ))}
          <div ref={sentinelRef} />
          {isFetchingNextPage && (
            <div style={{ display: "flex", justifyContent: "center", padding: "1rem" }}>
              <Spinner size={20} />
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}
