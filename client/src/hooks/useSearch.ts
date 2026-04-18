import { useQuery } from "@tanstack/react-query";
import { searchUsers, searchPosts } from "../api/search.api";
import { useDebounce } from "./useDebounce";

export const useSearchUsers = (query: string) => {
  const debounced = useDebounce(query, 400);
  return useQuery({
    queryKey: ["search", "users", debounced],
    queryFn: () => searchUsers(debounced),
    enabled: debounced.trim().length >= 2,
  });
};

export const useSearchPosts = (query: string) => {
  const debounced = useDebounce(query, 400);
  return useQuery({
    queryKey: ["search", "posts", debounced],
    queryFn: () => searchPosts(debounced),
    enabled: debounced.trim().length >= 2,
  });
};
