/**
 * USE POSTS HOOK
 * Purpose: Manages the fetching, caching, and updating of social posts.
 * Functions:
 * - useQuery: Fetches the feed and explore data with automatic background refresh.
 * - useMutation: Handles create, update, delete, like, and comment actions.
 * - Cache sync: Invalidates the relevant post queries after mutations complete.
 */

import { zodResolver } from "@hookform/resolvers/zod";
import {
  type QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  getExplore,
  getFeed,
  getPostById,
  updateLike,
  updatePost,
} from "../api/posts.api";
import { parseAxiosError } from "../lib/parseAxiosError";
import { toastAction, toastError } from "../lib/toast";

export const postKeys = {
  all: ["posts"] as const,
  feed: ["posts", "feed"] as const,
  explore: ["posts", "explore"] as const,
  detail: (id: string) => ["posts", id] as const,
};

const postSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Post content is required" })
    .max(225, { message: "Post cannot be longer than 225 characters" }),
});

type PostForm = z.infer<typeof postSchema>;

const commentSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Comment content is required" })
    .max(225, { message: "Comment cannot be longer than 225 characters" }),
});

type CommentForm = z.infer<typeof commentSchema>;

const invalidatePostLists = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: postKeys.feed });
  queryClient.invalidateQueries({ queryKey: postKeys.explore });
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
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) => getFeed(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data?.hasNext ? (lastPage.data.page ?? 1) + 1 : undefined,
  });
};

export const useExplore = () => {
  return useInfiniteQuery({
    queryKey: postKeys.explore,
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) => getExplore(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data?.hasNext ? (lastPage.data.page ?? 1) + 1 : undefined,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  const form = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      invalidatePostLists(queryClient);
      toastAction.published("Post published.");
    },
    onError: (error: unknown) => {
      toastError(parseAxiosError(error));
    },
  });

  const onSubmit = (data: PostForm) => {
    return mutation.mutateAsync(data);
  };

  return {
    register: form.register,
    handleSubmit: form.handleSubmit,
    setValue: form.setValue,
    formState: form.formState,
    onSubmit,
    isLoading: mutation.isPending,
    error: parseAxiosError(mutation.error),
  };
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  const form = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
    },
  });

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PostForm }) =>
      updatePost(id, data),
    onSuccess: (_, variables) => {
      invalidatePostLists(queryClient);
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.id) });
      toastAction.updated("Changes saved.");
    },
    onError: (error: unknown) => {
      toastError(parseAxiosError(error));
    },
  });

  const onSubmit = (id: string, data: PostForm) => {
    return mutation.mutateAsync({ id, data });
  };

  return {
    register: form.register,
    handleSubmit: form.handleSubmit,
    setValue: form.setValue,
    formState: form.formState,
    onSubmit,
    isLoading: mutation.isPending,
    error: parseAxiosError(mutation.error),
  };
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      invalidatePostLists(queryClient);
      toastAction.deleted("Post deleted.");
    },
    onError: (error: unknown) => {
      toastError(parseAxiosError(error));
    },
  });

  const onDelete = (id: string) => mutation.mutateAsync(id);

  return {
    onDelete,
    isLoading: mutation.isPending,
    error: parseAxiosError(mutation.error),
  };
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateLike,
    onSuccess: (_, postId) => {
      invalidatePostLists(queryClient);
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
    },
    onError: (error: unknown) => {
      toastError(parseAxiosError(error));
    },
  });

  const toggleLike = (postId: string) => mutation.mutateAsync(postId);

  return {
    toggleLike,
    isLoading: mutation.isPending,
    error: parseAxiosError(mutation.error),
  };
};

export const useCreateComment = (postId: string) => {
  const queryClient = useQueryClient();

  const form = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CommentForm) => createComment(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      invalidatePostLists(queryClient);
      form.reset();
      toastAction.submitted("Comment posted.");
    },
    onError: (error: unknown) => {
      toastError(parseAxiosError(error));
    },
  });

  const onSubmit = (data: CommentForm) => {
    return mutation.mutateAsync(data);
  };

  return {
    register: form.register,
    handleSubmit: form.handleSubmit,
    formState: form.formState,
    onSubmit,
    isLoading: mutation.isPending,
    error: parseAxiosError(mutation.error),
  };
};

export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ commentId }: { commentId: string }) =>
      deleteComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      invalidatePostLists(queryClient);
      toastAction.deleted("Comment deleted.");
    },
    onError: (error: unknown) => {
      toastError(parseAxiosError(error));
    },
  });

  const onDeleteComment = (commentId: string) => {
    return mutation.mutateAsync({ commentId });
  };

  return {
    onDeleteComment,
    isLoading: mutation.isPending,
    error: parseAxiosError(mutation.error),
  };
};
