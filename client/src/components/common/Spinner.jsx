export default function Spinner({ size = 20, color = "var(--lu-accent)" }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `2px solid var(--lu-surface2)`,
        borderTopColor: color,
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
        flexShrink: 0,
      }}
    />
  );
}
