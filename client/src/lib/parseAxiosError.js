/**
 * Extracts a human-readable message from an Axios error.
 * Returns null when the error is falsy (no active error).
 */
export const parseAxiosError = (error) => {
  if (!error) return null;
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong"
  );
};
