import { Notification } from '@prisma/client';
import prisma from '../../utils/prisma';

export const getNotifications = async (userId: string, limit: number = 20) => {
  return await prisma.notification.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    take: limit,
  });
};

export const getUnreadCount = async (userId: string) => {
  return await prisma.notification.count({
    where: { user_id: userId, read: false },
  });
};

export const markAsRead = async (id: string, userId: string) => {
  return await prisma.notification.updateMany({
    where: { id, user_id: userId },
    data: { read: true },
  });
};

export const markAllAsRead = async (userId: string) => {
  return await prisma.notification.updateMany({
    where: { user_id: userId, read: false },
    data: { read: true },
  });
};

export const deleteNotification = async (id: string, userId: string) => {
  return await prisma.notification.deleteMany({
    where: { id, user_id: userId },
  });
};

export const createNotification = async (data: {
  user_id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
}) => {
  return await prisma.notification.create({
    data,
  });
};
