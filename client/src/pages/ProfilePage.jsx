import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "../components/common/PageLayout";
import PageHeader from "../components/common/PageHeader";
import Avatar from "../components/common/Avatar";
import FollowButton from "../components/users/FollowButton";
import UserList from "../components/users/UserList";
import PostCard from "../components/posts/PostCard";
import Spinner from "../components/common/Spinner";
import Modal from "../components/common/Modal";
import { useProfile, useFollowers, useFollowings } from "../hooks/useFollow";
import { useAuth, useUpdateMe } from "../hooks/useAuth";
import { formatNumber } from "../utils/formatNumber";
import Button from "../components/common/Button";

export default function ProfilePage() {
  const { username } = useParams();
  const { user: me } = useAuth();
  const isMe = me?.username === username;

  const { data: profile, isLoading, isError } = useProfile(username);
  const [modal, setModal] = useState(null);

  const followers = useFollowers(username);
  const followings = useFollowings(username);
  const updateProfile = useUpdateMe({
    displayName: me?.displayName ?? "",
    bio: me?.bio ?? "",
    avatar_url: me?.avatarUrl ?? "",
  });
  const { setValue: setProfileValue } = updateProfile;

  const posts = profile?.posts ?? [];
  const followersList = followers.data?.pages.flatMap((page) => page.data ?? []) ?? [];
  const followingsList = followings.data?.pages.flatMap((page) => page.data ?? []) ?? [];
  const visibleProfile = isMe && me ? { ...profile, ...me, posts } : profile;

  useEffect(() => {
    if (!isMe || !me) return;
    setProfileValue("displayName", me.displayName ?? "");
    setProfileValue("bio", me.bio ?? "");
    setProfileValue("avatar_url", me.avatarUrl ?? "");
  }, [isMe, me, setProfileValue]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="lu-loading-wrap">
          <Spinner size={28} />
        </div>
      </PageLayout>
    );
  }

  if (isError || !profile) {
    return (
      <PageLayout>
        <div className="lu-card lu-empty-state">
          <p className="m-0 font-syne text-base text-[var(--lu-text)]">
            Profile unavailable
          </p>
          <p className="mt-2 text-sm">
            We could not build this profile from the live server data.
          </p>
        </div>
      </PageLayout>
    );
  }

  const statButtonStyle = (clickable) => ({
    background: "none",
    border: "none",
    cursor: clickable ? "pointer" : "default",
    padding: 0,
    textAlign: "left",
  });

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Profile"
        title={visibleProfile.displayName}
        subtitle={`@${visibleProfile.username}`}
      />

      <div className="lu-card lu-page-card mb-4">
        <div className="flex items-start gap-4 flex-wrap">
          <Avatar user={visibleProfile} size={72} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="lu-section-title text-xl">
                {visibleProfile.displayName}
              </h1>

              {isMe ? (
                <Button variant="outline" size="sm" onClick={() => setModal("edit")}>
                  Edit profile
                </Button>
              ) : (
                <FollowButton username={username} isFollowing={visibleProfile.isFollowing} />
              )}
            </div>

            <p className="text-sm text-[var(--lu-muted)] my-0.5 mb-2">
              @{visibleProfile.username}
            </p>

            {visibleProfile.bio && (
              <p className="text-sm text-[var(--lu-muted2)] leading-relaxed mb-3 font-light">
                {visibleProfile.bio}
              </p>
            )}

            <div className="lu-stat-grid">
              {[
                { label: "Posts", value: visibleProfile.postCount ?? posts.length },
                { label: "Followers", value: visibleProfile.followerCount, onClick: () => setModal("followers") },
                { label: "Following", value: visibleProfile.followingCount, onClick: () => setModal("following") },
              ].map(({ label, value, onClick }) => (
                <button key={label} type="button" onClick={onClick} className="lu-stat-button bg-transparent border-none p-0 text-left cursor-pointer hover:opacity-80">
                  <span className="lu-stat-value">
                    {formatNumber(value ?? 0)}
                  </span>
                  <span className="lu-stat-label">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lu-tabbar">
        <button type="button" className="lu-tab is-active">
          Posts
        </button>
      </div>

      <div className="lu-page">
        {posts.length === 0 ? (
          <p className="text-center text-[var(--lu-muted)] py-8 px-4 text-sm">
            No posts yet.
          </p>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id ?? post.id} post={post} currentUserId={me?._id ?? me?.id} />
          ))
        )}
      </div>

      <Modal isOpen={modal === "followers"} onClose={() => setModal(null)} title="Followers">
        <UserList
          users={followersList}
          isLoading={followers.isLoading}
          emptyMessage="No followers yet."
          currentUsername={me?.username}
        />
      </Modal>

      <Modal isOpen={modal === "following"} onClose={() => setModal(null)} title="Following">
        <UserList
          users={followingsList}
          isLoading={followings.isLoading}
          emptyMessage="Not following anyone yet."
          currentUsername={me?.username}
        />
      </Modal>

      <Modal isOpen={modal === "edit"} onClose={() => setModal(null)} title="Edit profile">
        <form
          onSubmit={updateProfile.handleSubmit(async (data) => {
            try {
              await updateProfile.onSubmit(data);
              setModal(null);
            } catch {
              // Error toast is handled in the hook.
            }
          })}
          className="lu-form-stack"
        >
          <label className="lu-form-group">
            <span className="lu-form-label">Display name</span>
            <input className="lu-input" {...updateProfile.register("displayName")} />
            {updateProfile.formState.errors.displayName && (
              <span className="lu-form-error">
                {updateProfile.formState.errors.displayName.message}
              </span>
            )}
          </label>

          <label className="lu-form-group">
            <span className="lu-form-label">Bio</span>
            <textarea
              className="lu-input lu-textarea"
              rows={4}
              {...updateProfile.register("bio")}
            />
            {updateProfile.formState.errors.bio && (
              <span className="lu-form-error">
                {updateProfile.formState.errors.bio.message}
              </span>
            )}
          </label>

          <label className="lu-form-group">
            <span className="lu-form-label">Avatar URL</span>
            <input
              className="lu-input"
              placeholder="https://..."
              {...updateProfile.register("avatar_url")}
            />
            {updateProfile.formState.errors.avatar_url && (
              <span className="lu-form-error">
                {updateProfile.formState.errors.avatar_url.message}
              </span>
            )}
          </label>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setModal(null)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={updateProfile.isLoading}>
              Save changes
            </Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
