import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { getMe, loginUser, logOut, registerUser, updateMe } from "../api/auth.api";
import { parseAxiosError } from "../lib/parseAxiosError";
import { toastAction, toastError } from "../lib/toast";

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
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      queryClient.setQueryData(["authUser"], user);
      toastAction.welcomeBack("Welcome back. You are signed in.");
      navigate("/");
    },
    onError: (error: unknown) => {
      toastError(parseAxiosError(error));
    },
  });

  const onSubmit = (data: LoginForm) => {
    mutation.mutate(data);
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

const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, "At least 3 characters")
      .max(30, "Max 30 characters"),
    displayName: z
      .string()
      .min(3, "At least 3 characters")
      .max(60, "Max 60 characters"),
    email: z.string().email("Enter a valid email").max(255),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .max(255)
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[\W_]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type SignupForm = z.infer<typeof signupSchema>;

export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (user) => {
      queryClient.setQueryData(["authUser"], user);
      toastAction.accountCreated("Account created. Welcome to LinkUp.");
      navigate("/");
    },
    onError: (error: unknown) => {
      toastError(parseAxiosError(error));
    },
  });

  const onSubmit = (data: SignupForm) => {
    const { confirmPassword, ...registerData } = data;

    mutation.mutate(registerData);
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

export const useAuth = () => {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getMe,
    retry: false,
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data,
    isError: query.isError,
    error: query.error,
  };
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      toastAction.signedOut("You have been signed out.");
      queryClient.clear();
      navigate("/login");
    },
    onError: () => {
      sessionStorage.removeItem("refreshToken");
      toastAction.signedOut("You have been signed out.");
      queryClient.clear();
      navigate("/login");
    }
  });
};

const updateProfileSchema = z.object({
  displayName: z.string().min(1, "Display name is required").max(60, "Max 60 characters"),
  bio: z.string().max(160, "Bio must be 160 characters or less").optional().or(z.literal("")),
  avatar_url: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
});

type UpdateProfileForm = z.infer<typeof updateProfileSchema>;

export const useUpdateMe = (defaultValues?: Partial<UpdateProfileForm>) => {
  const queryClient = useQueryClient();

  const form = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      displayName: defaultValues?.displayName ?? "",
      bio: defaultValues?.bio ?? "",
      avatar_url: defaultValues?.avatar_url ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: updateMe,
    onSuccess: (user) => {
      queryClient.setQueryData(["authUser"], user);
      toastAction.updated("Profile updated.");
    },
    onError: (error: unknown) => {
      toastError(parseAxiosError(error));
    },
  });

  const onSubmit = (data: UpdateProfileForm) => {
    const payload = {
      displayName: data.displayName,
      bio: data.bio || undefined,
      avatar_url: data.avatar_url || undefined,
    };

    return mutation.mutateAsync(payload);
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
