import { AppError } from '../error/AppError.js';
import db from '../models/index.js';

export async function quotationNotifications(userID) {
  return await db.models.Notification.findAll({
    include: [{    
        model: db.models.NotificationEntityType,
        as: 'entityType',
    }],
    where : {
      recipient_id : userID
    }
  });
}

export async function notificationReaded(notificationId) {

  const notification = await db.models.Notification.findByPk(notificationId, {
    include: [{    
        model: db.models.NotificationEntityType,
        as: 'entityType',
    }],
  });

  if (!notification) {
    throw new AppError('Notificación no encontrada', 404);
  }

  notification.status_id = 2;
  notification.read_at = new Date();

  await notification.save();
  return notification;
}