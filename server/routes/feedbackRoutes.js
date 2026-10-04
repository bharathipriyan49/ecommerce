const express = require("express");
const router = express.Router();
const { sendFeedbackNotification } = require("../services/telegramService");

router.post("/", async (req, res) => {
  const type = String(req.body.type || "").trim();
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim();
  const message = String(req.body.message || "").trim();

  if (!['Feedback', 'Report'].includes(type) || !message || message.length > 3000) {
    return res.status(400).json({
      message: "Choose a valid message type and enter a message up to 3000 characters.",
    });
  }

  if (name.length > 100 || email.length > 254) {
    return res.status(400).json({
      message: "Name or email is too long.",
    });
  }

  try {
    const notification = await sendFeedbackNotification({
      type,
      name,
      email,
      message,
    });

    if (notification.skipped) {
      return res.status(503).json({
        message: "Admin notifications are not configured. Please try again later.",
      });
    }

    return res.status(201).json({
      message: "Your message was sent to the admin.",
    });
  } catch (error) {
    console.error("Feedback notification error:", error);
    return res.status(502).json({
      message: "Could not notify the admin. Please try again later.",
    });
  }
});

module.exports = router;