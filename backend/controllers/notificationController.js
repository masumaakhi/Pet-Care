// backend/controllers/notificationController.js
const { sendSuccess, sendError } = require("../utils/response");
const notificationService = require("../services/NotificationService");

/**
 * Controller for Notifications
 */

/**
 * @desc    Get current user's notifications
 * @route   GET /api/notifications
 */
const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user.id);
    return sendSuccess(res, 200, "Notifications fetched", notifications);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Mark a notification as read
 * @route   PATCH /api/notifications/:id/read
 */
const markRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await notificationService.markAsReadForUser(req.user.id, id);
    if (!updated) {
      return sendError(res, 404, "Notification not found");
    }
    return sendSuccess(res, 200, "Notification marked as read", updated);
  } catch (error) {
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Mark all notifications read for current user
 * @route   PATCH /api/notifications/read-all
 */
const markAllRead = async (req, res) => {
  try {
    const result = await notificationService.markAllReadForUser(req.user.id);
    return sendSuccess(res, 200, "All notifications marked as read", {
      updated: result.count,
    });
  } catch (error) {
    console.error("markAllRead", error);
    return sendError(res, 500, "Internal Server Error");
  }
};

module.exports = {
  getNotifications,
  markRead,
  markAllRead,
};
