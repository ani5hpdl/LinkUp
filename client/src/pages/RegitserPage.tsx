import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";
import { registerUser } from "../api/auth.api";
import axios from "axios";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";

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

export default function Signup() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  // Watch fields for the "available" UI feedback
  const watchedUsername = watch("username");

  const onSubmit = async (data: SignupForm) => {
    setServerError(null);
    try {
      const { confirmPassword, ...registerData } = data;
      const response = await registerUser(registerData);
      if (response.success) {
        navigate("/");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        setServerError(message || "Something went wrong. Please try again.");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-void font-body selection:bg-lu-accent/30 lg:flex-row">
      {/* LEFT SIDE: HERO SECTION */}
      <div className="relative hidden flex-1 flex-col justify-between p-8 lg:flex lg:p-16">
        {" "}
        {/* Background Decorative Blobs */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-lu-accent/10 blur-[120px]" />
        <div className="relative z-10">
          <h1 className="font-display text-2xl font-bold tracking-tighter text-white lg:text-3xl">
            LinkUp
          </h1>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.3em] text-muted">
            Network Architecture v2.0
          </p>
        </div>
        <div className="relative z-10 mt-12 lg:mt-0">
          <span className="text-4xl text-lu-accent opacity-50 font-serif">
            “
          </span>
          <h2 className="font-display mt-[-10px] text-5xl font-bold leading-[1.1] tracking-tight text-white lg:text-7xl">
            Curate <br />
            your <span className="text-muted2">professional</span> <br />
            presence.
          </h2>
          <p className="mt-6 max-w-sm text-lg text-muted2">
            Join a minimalist network built for high-signal thinkers, creatives,
            and engineers.
          </p>
        </div>
        {/* Featured Components */}
        <div className="relative z-10 mt-12 flex flex-wrap gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3 pr-6 backdrop-blur-md">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-lu-accent to-pink" />
            <div>
              <p className="text-[10px] font-bold uppercase text-lu-accent">
                Featured
              </p>
              <p className="text-xs italic text-frost">
                "The signal-to-noise ratio is perfect."
              </p>
            </div>
          </div>
        </div>
        <footer className="relative z-10 mt-12 text-[10px] font-medium text-muted uppercase tracking-widest">
          © 2026 LinkUp Labs. Built for the modern web.
        </footer>
      </div>

      {/* RIGHT SIDE: FORM SECTION */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto bg-[#07070a] p-6 custom-scrollbar lg:p-12">
        {" "}
        <div className="w-full max-w-[440px] space-y-8">
          <div className="space-y-2">
            <h3 className="font-display text-4xl font-bold tracking-tight text-white">
              Create Account
            </h3>
            <p className="text-muted2">
              Set up your digital identity on LinkUp.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Display Name */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted2 ml-1">
                Display Name
              </Label>
              <Input
                {...register("displayName")}
                placeholder="Alex Rivera"
                className="h-12 border-none bg-white text-void placeholder:text-muted/60 focus-visible:ring-2 focus-visible:ring-lu-accent rounded-xl shadow-inner"
              />
              {errors.displayName && (
                <p className="text-[11px] text-pink font-medium px-1">
                  {errors.displayName.message}
                </p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted2 ml-1">
                Username
              </Label>
              <div className="relative group">
                <Input
                  {...register("username")}
                  placeholder="alexcurates"
                  className="h-12 border-none bg-white pr-10 text-void placeholder:text-muted/60 focus-visible:ring-2 focus-visible:ring-lu-accent rounded-xl"
                />
                {watchedUsername &&
                  watchedUsername.length > 2 &&
                  !errors.username && (
                    <CheckCircle2 className="absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-teal animate-in zoom-in" />
                  )}
              </div>
              {watchedUsername &&
                watchedUsername.length > 2 &&
                !errors.username && (
                  <p className="text-[10px] text-teal font-bold px-1 uppercase tracking-tighter">
                    Username is available
                  </p>
                )}
              {errors.username && (
                <p className="text-[11px] text-pink font-medium px-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted2 ml-1">
                Email Address
              </Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="alex@studio.com"
                className="h-12 border-none bg-white text-void placeholder:text-muted/60 focus-visible:ring-2 focus-visible:ring-lu-accent rounded-xl"
              />
              {errors.email && (
                <p className="text-[11px] text-pink font-medium px-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted2 ml-1">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-12 border-none bg-white pr-10 text-void placeholder:text-muted/60 focus-visible:ring-2 focus-visible:ring-lu-accent rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-void transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted2 ml-1">
                  Confirm
                </Label>
                <Input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="••••••••"
                  className="h-12 border-none bg-white text-void placeholder:text-muted/60 focus-visible:ring-2 focus-visible:ring-lu-accent rounded-xl"
                />
              </div>
            </div>
            {(errors.password || errors.confirmPassword) && (
              <p className="text-[11px] text-pink font-medium px-1">
                {errors.password?.message || errors.confirmPassword?.message}
              </p>
            )}

            {serverError && (
              <div className="rounded-xl bg-pink/10 border border-pink/20 p-3 text-xs text-pink text-center font-medium">
                {serverError}
              </div>
            )}

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                className="mt-1 h-3.5 w-3.5 rounded border-white/10 bg-white/5 accent-lu-accent"
                required
              />
              <p className="text-[11px] leading-relaxed text-muted2">
                I agree to the{" "}
                <span className="text-frost underline cursor-pointer">
                  Terms
                </span>{" "}
                and{" "}
                <span className="text-frost underline cursor-pointer">
                  Privacy Policy
                </span>
                .
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-14 w-full rounded-2xl bg-lu-accent text-base font-bold text-white shadow-lg shadow-lu-accent/20 transition-all hover:bg-lu-accent/90 hover:scale-[1.01] active:scale-[0.98]"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-muted">
              Already part of the network?{" "}
              <Link
                to="/login"
                className="font-bold text-frost hover:text-lu-accent transition-colors"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
