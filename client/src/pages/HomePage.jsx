import PageLayout from "../components/common/PageLayout";
import PostForm from "../components/posts/PostForm";
import PostCard from "../components/posts/PostCard";
import Spinner from "../components/common/Spinner";
import PageHeader from "../components/common/PageHeader";
import { useFeed } from "../hooks/usePosts";
import { useAuth } from "../hooks/useAuth";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

export default function HomePage() {
  const { user } = useAuth();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeed();
  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage);

  const posts = data?.pages.flatMap((p) => p.data?.posts ?? p.data ?? []) ?? [];

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Home"
        title="Your feed"
        subtitle="Catch up with the people you follow and share what's on your mind."
      />

      <div className="lu-card lu-page-card mb-4">
        <PostForm />
      </div>

      {isLoading ? (
        <div className="lu-empty-state">
          <Spinner size={28} />
        </div>
      ) : posts.length === 0 ? (
        <div className="lu-empty-state">
          <h2>Your feed is empty</h2>
          <p>Follow people to see their posts here.</p>
        </div>
      ) : (
        <div className="lu-page">
          {posts.map((post) => (
            <PostCard key={post._id ?? post.id} post={post} currentUserId={user?._id ?? user?.id} />
          ))}
          <div ref={sentinelRef} />
          {isFetchingNextPage && (
            <div className="lu-loading-wrap">
              <Spinner size={20} />
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}
