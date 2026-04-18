import { useAuth } from "../../hooks/useAuth";
import { useCreateComment } from "../../hooks/usePosts";
import Avatar from "../common/Avatar";
import Button from "../common/Button";

export default function CommentForm({ postId }) {
  const { user } = useAuth();
  const { register, handleSubmit, formState, onSubmit, isLoading, error } = useCreateComment(postId);

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        try {
          await onSubmit(data);
        } catch {
          // Error toast is handled in the hook.
        }
      })}
      style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
    >
      <Avatar user={user} size={30} />
      <div style={{ flex: 1 }}>
        <textarea
          {...register("content")}
          placeholder="Write a comment..."
          rows={2}
          maxLength={225}
          style={{
            width: "100%",
            resize: "none",
            background: "var(--lu-surface2)",
            border: "1px solid var(--lu-border)",
            borderRadius: 14,
            color: "var(--lu-text)",
            fontFamily: "DM Sans, sans-serif",
            fontSize: 14,
            fontWeight: 400,
            padding: "10px 12px",
            lineHeight: 1.6,
            transition: "border-color var(--lu-transition), box-shadow var(--lu-transition)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--lu-accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--lu-border)")}
        />
        {(formState.errors.content || error) && (
          <p style={{ fontSize: 11, color: "var(--lu-pink)", marginTop: 3 }}>
            {formState.errors.content?.message ?? error}
          </p>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
          <Button type="submit" variant="teal" size="sm" isLoading={isLoading}>
            Comment
          </Button>
        </div>
      </div>
    </form>
  );
}
