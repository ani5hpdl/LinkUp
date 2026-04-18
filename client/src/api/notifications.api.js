import api from "./axios";

export const getNotifications = (page = 1, limit = 20) =>
  api.get("/notification", { params: { page, limit } }).then((r) => r.data);

const fetchAllNotifications = async (limit = 50) => {
  const all = [];
  let page = 1;

  while (true) {
    const response = await getNotifications(page, limit);
    const notifications = response.data ?? [];
    all.push(...notifications);

    if (notifications.length < limit) break;
    page += 1;
  }

  return all;
};

export const markAllRead = async () => {
  const notifications = await fetchAllNotifications();
  const unread = notifications.filter((n) => !n.isRead && !n.read);

  await Promise.all(
    unread.map((notif) => markRead(notif.id ?? notif._id))
  );

  return { success: true, message: "All notifications marked as read." };
};

export const markRead = (id) =>
  api.patch(`/notification/${id}/read`).then((r) => r.data);

export const getUnreadCount = async () => {
  const notifications = await fetchAllNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead && !n.read).length;
  return { count: unreadCount };
};
