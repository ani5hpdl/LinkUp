import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--lu-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "Syne, sans-serif",
          fontWeight: 800,
          fontSize: 96,
          letterSpacing: "-4px",
          background: "linear-gradient(135deg, #7B6EF6, #A594F9)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1,
          marginBottom: "0.5rem",
        }}
      >
        404
      </div>
      <p style={{ fontFamily: "Syne, sans-serif", fontSize: 18, color: "var(--lu-text)", marginBottom: 8 }}>
        Page not found
      </p>
      <p style={{ fontSize: 13, color: "var(--lu-muted)", marginBottom: "2rem", maxWidth: 300 }}>
        The page you're looking for doesn't exist or was moved.
      </p>
      <Link
        to="/"
        className="lu-btn lu-btn-primary"
        style={{ textDecoration: "none" }}
      >
        Go home
      </Link>
    </div>
  );
}
