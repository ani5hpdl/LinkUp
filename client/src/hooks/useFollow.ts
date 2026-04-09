/**
 * USE FOLLOW HOOK
 * Purpose: Encapsulates the follow/unfollow toggle logic.
 * * Functions:
 * - toggleFollow: Calls the API and updates the local UI state.
 * - loadingState: Prevents multiple API calls if the user clicks the button rapidly.
 * - syncCache: Updates the 'Followers' list in the React Query cache upon success.
 */