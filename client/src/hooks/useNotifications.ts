import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadCount,
  markAllRead,
  markRead,
} from "../api/notifications.api";
import { parseAxiosError } from "../lib/parseAxiosError";
import { toastAction, toastError } from "../lib/toast";

export const notifKeys = {
  all:          ["notifications"] as const,
  list:         ["notifications", "list"] as const,
  unreadCount:  ["notifications", "unread"] as const,
};

export const useNotifications = () => {
  return useInfiniteQuery({
    queryKey: notifKeys.list,
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) => getNotifications(pageParam, 20),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      const pageSize = lastPage.data?.length ?? 0;
      return pageSize < 20 ? undefined : (lastPage.page ?? 1) + 1;
    },
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: notifKeys.unreadCount,
    queryFn: getUnreadCount,
    refetchInterval: 30_000,
  });
};

export const useMarkAllRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notifKeys.list });
      queryClient.invalidateQueries({ queryKey: notifKeys.unreadCount });
      toastAction.saved("All notifications marked as read.");
    },
    onError: (error: unknown) => {
      toastError(parseAxiosError(error) || "Could not mark notifications as read.");
    },
  });
};

export const useMarkRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notifKeys.list });
      queryClient.invalidateQueries({ queryKey: notifKeys.unreadCount });
    },
    onError: (error: unknown) => {
      toastError(parseAxiosError(error) || "Could not update notification.");
    },
  });
};
