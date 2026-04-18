import Spinner from "./Spinner";

/**
 * Button variants: "primary" | "outline" | "ghost" | "teal" | "danger"
 */
export default function Button({
  type = "button",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  className = "",
  style,
  ...props
}) {
  const variantClass = `lu-btn-${variant}`;
  const sizeStyle =
    size === "sm"
      ? { padding: "5px 12px", fontSize: 12 }
      : size === "lg"
      ? { padding: "10px 24px", fontSize: 14 }
      : {};

  return (
    <button
      type={type}
      aria-busy={isLoading || undefined}
      className={`lu-btn ${variantClass} ${className}`.trim()}
      style={{ ...sizeStyle, ...style }}
      {...props}
      disabled={disabled || isLoading}
    >
      {isLoading ? <Spinner size={14} color="currentColor" /> : null}
      {children}
    </button>
  );
}
