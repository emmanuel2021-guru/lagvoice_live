const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getPreferences = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let prefs = await prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!prefs) {
      prefs = await prisma.notificationPreference.create({
        data: { userId },
      });
    }

    res.status(200).json({ success: true, data: prefs });
  } catch (err) {
    next(err);
  }
};

exports.updatePreferences = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { email, push, sms, complaints, evaluations, polls } = req.body;

    const updatedPrefs = await prisma.notificationPreference.upsert({
      where: { userId },
      update: {
        email: email !== undefined ? email : undefined,
        push: push !== undefined ? push : undefined,
        sms: sms !== undefined ? sms : undefined,
        complaints: complaints !== undefined ? complaints : undefined,
        evaluations: evaluations !== undefined ? evaluations : undefined,
        polls: polls !== undefined ? polls : undefined,
      },
      create: {
        userId,
        email: email !== undefined ? email : true,
        push: push !== undefined ? push : true,
        sms: sms !== undefined ? sms : false,
        complaints: complaints !== undefined ? complaints : true,
        evaluations: evaluations !== undefined ? evaluations : true,
        polls: polls !== undefined ? polls : true,
      }
    });

    res.status(200).json({ success: true, data: updatedPrefs });
  } catch (err) {
    next(err);
  }
};
