import { prisma } from "../../config/db";
import type { AuthRequest } from "../../middleware/authenticate";
import type { ApiResponse } from "../../types";
import { getPagination } from "../../utils/paginate";
import type { Response } from "express";

export const getNotification = async (
  req: AuthRequest,
  res: Response,
): Promise<Response<ApiResponse>> => {
  try {
    const userId = req.user!.id;

    const { page, limit, skip } = getPagination(req);

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: userId,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    if (notifications.length === 0) {
      return res.status(200).json({
        success: true,
        message: "All Notification Fetched",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "All notification fetched.",
      data: notifications,
      page,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error,
    });
  }
};

export const readNotification = async (
  req: AuthRequest,
  res: Response,
): Promise<Response<ApiResponse>> => {
  try {
    const { notificationId } = req.params as { notificationId: string };
    const userId = req.user!.id;

    const notification = await prisma.notification.findUnique({
      where: {
        id: notificationId,
        recipientId: userId,
      },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found with this Id.",
      });
    }

    await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Notification marks as read.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error,
    });
  }
};
