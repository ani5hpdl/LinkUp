import { useEffect, useRef } from "react";

/**
 * Calls fetchNextPage() when the ref element scrolls into view.
 * Attach the ref to a sentinel div at the bottom of your list.
 *
 * Usage:
 *   const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeed();
 *   const ref = useInfiniteScroll(fetchNextPage, hasNextPage);
 *
 *   return (
 *     <>
 *       {posts.map(post => <PostCard key={post.id} post={post} />)}
 *       <div ref={ref} />   ← sentinel — triggers load when visible
 *       {isFetchingNextPage && <Spinner />}
 *     </>
 *   );
 */
export const useInfiniteScroll = (
  fetchNextPage: () => void,
  hasNextPage:   boolean | undefined
) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // fires when sentinel enters the viewport
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 } // trigger when 10% of sentinel is visible
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  return ref;
};