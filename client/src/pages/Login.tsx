import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { loginUser } from "../api/auth";

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

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: LoginForm) => {
    setServerError(null);

    try {
      const response = await loginUser(data);
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
      {/* LEFT SIDE: Branding */}
      <div className="relative hidden flex-1 flex-col justify-between p-8 lg:flex lg:p-16">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-lu-accent/10 blur-[120px]" />

        <div className="relative z-10">
          <h1 className="font-display text-2xl font-bold tracking-tighter text-white lg:text-3xl">
            LinkUp
          </h1>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.3em] text-muted">
            Network Architecture v2.0
          </p>
        </div>

        <div className="relative z-10">
          <h2 className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-white lg:text-7xl">
            Welcome <br />
            <span className="text-muted2">back to the</span> <br />
            network.
          </h2>
          <p className="mt-6 max-w-sm text-lg text-muted2">
            Continue curating your professional presence and connecting with the
            collective.
          </p>
        </div>

        <footer className="relative z-10 text-[10px] font-medium text-muted uppercase tracking-widest">
          © 2026 LinkUp Labs. Built for the modern web.
        </footer>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto bg-[#07070a] p-6 custom-scrollbar lg:p-12">
        <div className="w-full max-w-[400px] space-y-8">
          <header className="space-y-2">
            <h3 className="font-display text-4xl font-bold tracking-tight text-white">
              Sign In
            </h3>
            <p className="text-muted2">
              Enter your credentials to access your account.
            </p>
          </header>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-12 rounded-xl border-white/5 bg-white/[0.03] text-white hover:bg-white/90 transition-all"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-xl border-white/5 bg-white/[0.03] text-white hover:bg-white/90 transition-all"
            >
              <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </Button>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-widest text-muted">
              Or continue with
            </span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted2 ml-1">
                  Email Address
                </Label>
                <Input
                  {...register("email")}
                  placeholder="alex@studio.com"
                  className="h-12 border-none bg-white text-void placeholder:text-muted/60 focus-visible:ring-2 focus-visible:ring-lu-accent rounded-xl"
                />
                {errors.email && (
                  <p className="text-[11px] font-medium text-pink px-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-void transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] font-medium text-pink px-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  className="border-white/20 data-[state=checked]:bg-lu-accent data-[state=checked]:border-lu-accent"
                />
                <label
                  htmlFor="remember"
                  className="text-[11px] font-medium leading-none text-muted2 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-[11px] font-bold text-sm-lu-accent-light hover:text-lu-accent transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {serverError && (
              <div className="rounded-xl bg-pink/10 border border-pink/20 p-3 text-xs text-pink text-center font-medium">
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-14 w-full rounded-2xl bg-lu-accent text-base font-bold text-white shadow-lg shadow-lu-accent/20 transition-all hover:bg-lu-accent/90 hover:scale-[1.01] active:scale-[0.98]"
            >
              {isSubmitting ? "Authenticating..." : "Sign in to account"}
            </Button>

            <p className="text-center text-sm text-muted">
              New to the network?{" "}
              <Link
                to="/signup"
                className="font-bold text-frost hover:text-lu-accent transition-colors"
              >
                Create account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
