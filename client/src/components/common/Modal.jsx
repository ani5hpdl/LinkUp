import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      role="presentation"
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="lu-card"
        role="dialog"
        aria-modal="true"
        aria-label={title || "Dialog"}
        style={{
          width: "100%", maxWidth: 520,
          padding: "1.25rem",
          animation: "fadeUp 0.2s ease forwards",
        }}
      >
        {title && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: "1rem",
          }}>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 800, color: "var(--lu-text)", letterSpacing: "-0.03em" }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--lu-muted)", lineHeight: 1 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
