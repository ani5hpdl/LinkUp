/**
 * USE POSTS HOOK
 * Purpose: Manages the fetching, caching, and updating of social posts.
 * * Functions:
 * - useQuery: Fetches the 'feed' and 'explore' data with automatic background refresh.
 * - useMutation: Handles 'Create Post' and 'Delete Post' with cache invalidation.
 * - Optimistic Updates: Updates the 'Like' count instantly before the server responds.
 */