/**
 * USE FOLLOW HOOK
 * Purpose: Encapsulates the follow/unfollow workflow and profile related queries.
 * Functions:
 * - useProfile: Fetches the profile and post feed for a username.
 * - useFollowers / useFollowings: Paginated follow lists.
 * - useToggleFollow: Toggles the follow state and refreshes cached profile data.
 */

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFollowers,
  getFollowings,
  getProfile,
  toggleFollow,
} from "../api/users.api";
import { parseAxiosError } from "../lib/parseAxiosError";

export const followKeys = {
  all: ["follow"] as const,
  profile: (username: string) => ["follow", "profile", username] as const,
  followers: (username: string) => ["follow", "followers", username] as const,
  followings: (username: string) => ["follow", "followings", username] as const,
};

export const useProfile = (username: string) => {
  return useQuery({
    queryKey: followKeys.profile(username),
    queryFn: () => getProfile(username),
    enabled: !!username,
    retry: 1,
  });
};

export const useFollowers = (username: string) => {
  return useInfiniteQuery({
    queryKey: followKeys.followers(username),
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) => getFollowers(username, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const pageSize = lastPage.data?.length ?? 0;
      const total = lastPage.count ?? 0;
      const loaded = allPages.reduce((sum, page) => sum + (page.data?.length ?? 0), 0);

      if (pageSize === 0) return undefined;
      if (loaded >= total) return undefined;

      return allPages.length + 1;
    },
  });
};

export const useFollowings = (username: string) => {
  return useInfiniteQuery({
    queryKey: followKeys.followings(username),
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) => getFollowings(username, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const pageSize = lastPage.data?.length ?? 0;
      const total = lastPage.count ?? 0;
      const loaded = allPages.reduce((sum, page) => sum + (page.data?.length ?? 0), 0);

      if (pageSize === 0) return undefined;
      if (loaded >= total) return undefined;

      return allPages.length + 1;
    },
  });
};

export const useToggleFollow = (username: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => toggleFollow(username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: followKeys.profile(username) });
      queryClient.invalidateQueries({ queryKey: followKeys.followers(username) });
      queryClient.invalidateQueries({ queryKey: followKeys.followings(username) });
    },
  });

  const onToggleFollow = () => {
    mutation.mutate();
  };

  return {
    onToggleFollow,
    isLoading: mutation.isPending,
    error: parseAxiosError(mutation.error),
  };
};
