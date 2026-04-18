import UserCard from "./UserCard";
import Spinner from "../common/Spinner";

export default function UserList({
  users = [],
  isLoading,
  emptyMessage = "No users found.",
  currentUsername,
}) {
  if (isLoading) {
    return (
      <div className="lu-empty-state">
        <Spinner />
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="lu-empty-state">
        <h2>No results</h2>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="lu-page">
      {users.map((u) => (
        <UserCard key={u._id ?? u.id ?? u.username} user={u} currentUsername={currentUsername} />
      ))}
    </div>
  );
}
