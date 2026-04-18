import { useEffect, useRef, useState } from "react";
import Avatar from "../common/Avatar";
import { useAuth } from "../../hooks/useAuth";

export default function AvatarUpload() {
  const { user } = useAuth();
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Preview a new avatar"
        title="Preview a new avatar"
        style={{
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          borderRadius: "50%",
          position: "relative",
        }}
      >
        <Avatar user={{ ...user, avatarUrl: preview ?? user?.avatarUrl }} size={72} />
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.35)",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.15s ease",
            pointerEvents: "none",
          }}
        >
          Preview
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleChange}
      />
      <p style={{ margin: 0, fontSize: 11, color: "var(--lu-muted)", textAlign: "center" }}>
        Avatar upload is preview-only in this build.
      </p>
    </div>
  );
}
