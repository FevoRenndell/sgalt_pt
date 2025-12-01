import {
    notificationReaded,
    quotationNotifications,
} from '../services/notificationService.js';

export const fetchNotifications = async (req, res, next) => {
    try {
        const notifications = await quotationNotifications(req.params.userID);
        res.status(200).json(notifications);
    } catch (error) {
        next(error);
    }
};

export const readNotification = async (req, res, next) => {
     try {
        const notifications = await notificationReaded(req.params.notificationId);
        res.status(200).json(notifications);
    } catch (error) {
        next(error);
    }
}
 
