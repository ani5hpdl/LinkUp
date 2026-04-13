import type { AxiosError } from "axios";

export const parseAxiosError = (error: unknown): string | null => {
  if ((error as AxiosError)?.isAxiosError) {
    return (error as AxiosError<any>).response?.data?.message ?? null;
  }
  if (error instanceof Error) return error.message;
  return null;
};