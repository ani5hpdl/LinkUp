import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { loginUser } from "../api/auth.api";

/**
 * USE AUTH HOOK
 * Purpose: Provides a type-safe wrapper for the AuthContext.
 * * Functions:
 * - Returns the user object, isAuthenticated boolean, and auth methods.
 * - Throws an error if used outside of the AuthProvider.
 */
const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email cannot be longer than 255 characters" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(255, { message: "Password cannot be longer than 255 characters" }),
});
type LoginForm = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const navigate = useNavigate();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
        email: "",
        password: ""
    },
  });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      if (response.success) {
        navigate("/");
      }else{
        throw new Error(response.message || "Login Failed.")
      }
    },
    onError: (error: unknown) => {
      console.error(error);
    },
  });

  const parsedErrorMessage =
    (mutation.error as any)?.response?.data?.message ||
    (mutation.error as Error)?.message ||
    null;

  const onSubmit = (data: LoginForm) => {
    mutation.mutate(data);
  };

  return {
    ...form,
    onSubmit,
    isLoading: mutation.isPending,
    error: parsedErrorMessage,
  };
};
