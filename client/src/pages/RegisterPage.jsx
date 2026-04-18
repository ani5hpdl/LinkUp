import { Link } from "react-router-dom";
import { useRegister } from "../hooks/useAuth";
import Button from "../components/common/Button";

export default function RegisterPage() {
  const { register, handleSubmit, formState, onSubmit, isLoading, error } = useRegister();

  const fields = [
    { name: "username",     label: "USERNAME",      type: "text",     placeholder: "yourhandle" },
    { name: "displayName",  label: "DISPLAY NAME",  type: "text",     placeholder: "Your Name" },
    { name: "email",        label: "EMAIL",         type: "email",    placeholder: "you@example.com" },
    { name: "password",     label: "PASSWORD",      type: "password", placeholder: "********" },
    { name: "confirmPassword", label: "CONFIRM PASSWORD", type: "password", placeholder: "********" },
  ];

  return (
    <div className="lu-auth-shell">
      <div className="lu-auth-orb lu-auth-orb--violet" style={{ top: "10%", right: "18%", width: 350, height: 350 }} />
      <div className="lu-auth-orb lu-auth-orb--pink" style={{ bottom: "10%", left: "12%", width: 280, height: 280 }} />

      <div className="page-enter" style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div className="lu-brand-mark" style={{ fontSize: 38 }}>
            LinkUp
          </div>
          <p style={{ fontSize: 13, color: "var(--lu-muted)", marginTop: 8, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>
            Create your account
          </p>
        </div>

        <div className="lu-card lu-page-card">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="lu-form-stack">
            {fields.map(({ name, label, type, placeholder }) => (
              <div key={name} className="lu-form-group">
                <label className="lu-form-label">
                  {label}
                </label>
                <input
                  {...register(name)}
                  type={type}
                  placeholder={placeholder}
                  className="lu-input"
                  autoComplete={name === "email" ? "email" : name === "password" ? "new-password" : undefined}
                />
                {formState.errors[name] && (
                  <p className="lu-form-error">
                    {formState.errors[name].message}
                  </p>
                )}
              </div>
            ))}

            {error && (
              <div className="lu-callout">
                {error}
              </div>
            )}

            <Button type="submit" isLoading={isLoading} className="lu-btn-wide">
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: 13, color: "var(--lu-muted)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--lu-accent2)", textDecoration: "none", fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
