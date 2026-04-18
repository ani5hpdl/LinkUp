import PageLayout from "../components/common/PageLayout";
import NotificationItem from "../components/notifications/NotificationItem";
import Spinner from "../components/common/Spinner";
import Button from "../components/common/Button";
import PageHeader from "../components/common/PageHeader";
import { useNotifications, useMarkAllRead, useMarkRead } from "../hooks/useNotifications";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

export default function NotificationsPage() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useNotifications();
  const markAll = useMarkAllRead();
  const markOne = useMarkRead();
  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage);

  const notifs = data?.pages.flatMap((p) => p.data ?? []) ?? [];
  const hasUnread = notifs.some((n) => !(n.isRead ?? n.read));

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        subtitle="Stay up to date with the latest activity."
        actions={hasUnread ? (
          <Button variant="ghost" size="sm" onClick={() => markAll.mutate()} isLoading={markAll.isPending}>
            Mark all read
          </Button>
        ) : null}
      />

      {isLoading ? (
        <div className="lu-empty-state">
          <Spinner size={28} />
        </div>
      ) : notifs.length === 0 ? (
        <div className="lu-empty-state">
          <h2>All caught up!</h2>
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div className="lu-page">
          {notifs.map((n) => (
            <NotificationItem
              key={n._id ?? n.id}
              notif={n}
              onRead={(id) => markOne.mutate(id)}
            />
          ))}
          <div ref={sentinelRef} />
          {isFetchingNextPage && (
            <div className="lu-loading-wrap">
              <Spinner size={20} />
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}
