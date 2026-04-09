/**
 * USE INFINITE SCROLL HOOK
 * Purpose: Handles automatic data loading when the user scrolls to the bottom.
 * * Parameters:
 * - threshold: How close to the bottom before triggering the fetch.
 * - callback: The function to execute (e.g., fetchNextPage).
 * * Main Logic: Uses IntersectionObserver to watch a "sentinel" div at the end of a list.
 */