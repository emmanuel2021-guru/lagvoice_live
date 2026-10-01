const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getMessages = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type } = req.query; // 'inbox' or 'sent'
    
    let messages = [];
    if (type === 'sent') {
      messages = await prisma.internalMessage.findMany({
        where: { senderId: userId },
        include: { recipient: { select: { name: true, email: true, department: true } } },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      messages = await prisma.internalMessage.findMany({
        where: { recipientId: userId },
        include: { sender: { select: { name: true, email: true, department: true } } },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { recipientId, subject, body } = req.body;

    if (!recipientId || !subject || !body) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const message = await prisma.internalMessage.create({
      data: {
        senderId,
        recipientId: parseInt(recipientId, 10),
        subject,
        body
      }
    });

    res.status(201).json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const message = await prisma.internalMessage.updateMany({
      where: { id: parseInt(id, 10), recipientId: userId },
      data: { isRead: true }
    });

    res.status(200).json({ success: true, message: 'Marked as read' });
  } catch (err) {
    next(err);
  }
};

exports.getStaffUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: { in: ['admin', 'hod', 'staff'] } },
      select: { id: true, name: true, email: true, department: true, role: true }
    });
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};
