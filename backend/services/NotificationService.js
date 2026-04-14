// backend/services/NotificationService.js
const prisma = require("../prisma/prismaClient");
const socketService = require("./SocketService");

/**
 * Service for handling notifications (In-app, Email, SMS placeholders)
 */
class NotificationService {
  /**
   * Dispatch a notification (Non-blocking)
   */
  async dispatch(userId, { title, message, type = "SYSTEM", data = {} }) {
    try {
      const notification = await prisma.rescueNotification.create({
        data: {
          userId,
          title,
          message,
          type,
        },
      });

      console.log(`[Notification Dispatch] to ${userId}: ${title} - ${message}`);

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, fullName: true, phone: true },
      });
      if (user && user.email) {
        await this.sendEmail(user.email, title, message, user.fullName);
      }
      if (user && user.phone) {
        await this.sendWhatsAppSmsStub(user.phone, `${title}: ${message}`);
      }

      socketService.emitToUser(userId, "notification:new", {
        id: notification.id,
        title,
        message,
        type,
        createdAt: notification.createdAt,
      });

      return notification;
    } catch (error) {
      console.error("Notification Dispatch Error:", error);
    }
  }

  /**
   * Helper to simulate Email sending
   */
  async sendEmail(to, subject, body, name) {
    // In a real app, use nodemailer or a service like SendGrid
    console.log(`
      --------------------------------------------------
      [OUTGOING EMAIL]
      TO: ${name} <${to}>
      SUBJECT: ${subject}
      BODY: ${body}
      --------------------------------------------------
    `);
    // Placeholder for actual nodemailer implementation:
    /*
    const transporter = nodemailer.createTransport({...});
    await transporter.sendMail({ from, to, subject, text, html });
    */
    return true;
  }

  /**
   * WhatsApp / SMS provider stub (Twilio, etc.)
   */
  async sendWhatsAppSmsStub(phone, body) {
    console.log(`
      --------------------------------------------------
      [WHATSAPP/SMS STUB]
      TO: ${phone}
      BODY: ${body}
      --------------------------------------------------
    `);
    return true;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id) {
    return await prisma.rescueNotification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAsReadForUser(userId, id) {
    const row = await prisma.rescueNotification.findFirst({
      where: { id, userId },
    });
    if (!row) return null;
    return await prisma.rescueNotification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  /** Mark every notification read for this user (e.g. bell opened). */
  async markAllReadForUser(userId) {
    const result = await prisma.rescueNotification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return result;
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId) {
    return await prisma.rescueNotification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }
}

module.exports = new NotificationService();
