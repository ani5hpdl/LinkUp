import { useEffect } from "react";
import { useCreatePost, useUpdatePost } from "../../hooks/usePosts";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../common/Avatar";
import Button from "../common/Button";

const MAX = 225;

/**
 * If postId is passed → edit mode (useUpdatePost).
 * Otherwise → create mode (useCreatePost).
 */
export default function PostForm({ postId, defaultContent = "", onSuccess }) {
  const { user } = useAuth();
  const create = useCreatePost();
  const update = useUpdatePost();

  const isEdit = !!postId;
  const { register, handleSubmit, formState, onSubmit: hookSubmit, isLoading, error } =
    isEdit ? update : create;

  // Pre-fill when editing
  const { setValue } = isEdit ? update : create;
  useEffect(() => {
    if (isEdit && setValue) setValue("content", defaultContent ?? "");
  }, [isEdit, defaultContent, setValue]);

  const handleSubmitWrapped = handleSubmit(async (data) => {
    try {
      if (isEdit) {
        await hookSubmit(postId, data);
      } else {
        await hookSubmit(data);
      }
      if (onSuccess) onSuccess();
    } catch {
      // Error toast is handled in the hook.
    }
  });

  return (
    <form onSubmit={handleSubmitWrapped}>
      <div className="flex gap-2.5 items-start">
        {!isEdit && <Avatar user={user} size={34} />}
        <div className="flex-1">
          <textarea
            {...register("content")}
            placeholder="What's on your mind?"
            defaultValue={defaultContent}
            maxLength={MAX}
            rows={isEdit ? 4 : 3}
            className="w-full resize-none bg-[var(--lu-surface2)] border border-[var(--lu-border)] rounded-2xl text-[var(--lu-text)] font-[DM_Sans] text-sm font-normal p-[12px_14px] leading-loose transition-all focus-visible:border-[var(--lu-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lu-accent)]/20"
          />
          {formState.errors.content && (
            <p className="text-xs text-[var(--lu-pink)] mt-1">
              {formState.errors.content.message}
            </p>
          )}
          {error && (
            <p className="text-xs text-[var(--lu-pink)] mt-1">{error}</p>
          )}
          <div className="flex justify-end mt-2">
            <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
              {isEdit ? "Save" : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
