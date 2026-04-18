import { useToggleFollow } from "../../hooks/useFollow";
import Button from "../common/Button";

export default function FollowButton({ username, isFollowing }) {
  const { onToggleFollow, isLoading, isSupported } = useToggleFollow(username);

  return (
    <Button
      variant={isFollowing ? "outline" : "primary"}
      size="sm"
      isLoading={isLoading}
      disabled={!isSupported}
      title={!isSupported ? "Follow actions are unavailable in this build" : undefined}
      onClick={onToggleFollow}
    >
      {isSupported ? (isFollowing ? "Unfollow" : "Follow") : "Follow unavailable"}
    </Button>
  );
}
