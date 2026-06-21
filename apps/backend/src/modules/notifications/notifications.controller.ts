import { Request, Response } from 'express';
import * as notificationService from './notifications.service';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user!.id;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    
    const notifications = await notificationService.getNotifications(userId, limit);
    const unreadCount = await notificationService.getUnreadCount(userId);
    
    res.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user!.id;
    const { id } = req.params;
    
    await notificationService.markAsRead(id, userId);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user!.id;
    
    await notificationService.markAllAsRead(userId);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notifications' });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user!.id;
    const { id } = req.params;
    
    await notificationService.deleteNotification(id, userId);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};
