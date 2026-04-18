import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import Button from "../components/common/Button";

export default function LoginPage() {
  const { register, handleSubmit, formState, onSubmit, isLoading, error } = useLogin();

  return (
    <div className="lu-auth-shell">
      <div className="lu-auth-orb lu-auth-orb--violet" style={{ top: "15%", left: "20%", width: 400, height: 400 }} />
      <div className="lu-auth-orb lu-auth-orb--teal" style={{ bottom: "20%", right: "15%", width: 300, height: 300 }} />

      <div className="page-enter" style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div className="lu-brand-mark" style={{ fontSize: 38 }}>
            LinkUp
          </div>
          <p style={{ fontSize: 13, color: "var(--lu-muted)", marginTop: 8, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>
            Welcome back
          </p>
        </div>

        <div className="lu-card lu-page-card">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="lu-form-stack">
            <div className="lu-form-group">
              <label className="lu-form-label">
                EMAIL
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="lu-input"
                autoComplete="email"
              />
              {formState.errors.email && (
                <p className="lu-form-error">{formState.errors.email.message}</p>
              )}
            </div>

            <div className="lu-form-group">
              <label className="lu-form-label">
                PASSWORD
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="********"
                className="lu-input"
                autoComplete="current-password"
              />
              {formState.errors.password && (
                <p className="lu-form-error">{formState.errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="lu-callout">
                {error}
              </div>
            )}

            <Button type="submit" isLoading={isLoading} className="lu-btn-wide">
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: 13, color: "var(--lu-muted)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--lu-accent2)", textDecoration: "none", fontWeight: 500 }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
