/**
 * USE POSTS HOOK
 * Purpose: Manages the fetching, caching, and updating of social posts.
 * * Functions:
 * - useQuery: Fetches the 'feed' and 'explore' data with automatic background refresh.
 * - useMutation: Handles 'Create Post' and 'Delete Post' with cache invalidation.
 * - Optimistic Updates: Updates the 'Like' count instantly before the server responds.
 */

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getExplore, getFeed, getPostById } from "../api/posts.api";

export const postKeys = {
  all: ["posts"] as const,
  feed: ["posts", "feed"] as const,
  explore: ["posts", "explore"] as const,
  detail: (id: string) => ["posts", id] as const,
};

export const usePost = (postId: string) => {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => getPostById(postId),
    enabled: !!postId,
    retry: 1,
  });
};

export const useFeed = () => {
  return useInfiniteQuery({
    queryKey: postKeys.feed,
    queryFn: getFeed,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.page + 1 : undefined,
  });
};


export const useExplore = () => {
  return useInfiniteQuery({
    queryKey: postKeys.explore,
    queryFn: getExplore,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => 
      lastPage.data.hasNext ? lastPage.data.page + 1 : undefined,
  });
}

export const useCreatePost = () => {
  const queryclient = useQueryClient();

  return useMutation({
    mutationFn: 
  })
}