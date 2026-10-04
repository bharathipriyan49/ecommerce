function getTelegramConfig() {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_CHAT_ID } = process.env;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_CHAT_ID) {
    return null;
  }

  return {
    botToken: TELEGRAM_BOT_TOKEN,
    adminChatId: TELEGRAM_ADMIN_CHAT_ID,
  };
}

async function sendTelegramMessage(message) {
  const config = getTelegramConfig();

  console.log("Telegram Config:", {
    hasBotToken: !!config?.botToken,
    adminChatId: config?.adminChatId,
  });

  if (!config) {
    console.warn(
      "Telegram notification skipped: bot token or admin chat ID is not configured"
    );

    return {
      sent: false,
      skipped: true,
    };
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${config.botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: config.adminChatId,
          text: message,
        }),
      }
    );

    const result = await response.json();

    console.log("Telegram API response:", {
      status: response.status,
      ok: result.ok,
      description: result.description || "Success",
    });

    if (!response.ok || !result.ok) {
      throw new Error(
        `Telegram API request failed (${response.status}): ${
          result.description || "Unknown error"
        }`
      );
    }

    console.log("✅ Telegram notification sent successfully");

    return {
      sent: true,
      skipped: false,
    };
  } catch (error) {
    console.error("❌ Telegram notification failed:", error.message);
    throw error;
  }
}

function getOrderDetails(order) {
  const items = order.products.map((item) => {
    const productName =
      item.product && typeof item.product === "object"
        ? item.product.name
        : "Product";

    return `${productName} x ${item.quantity} @ ₹${item.price} = ₹${
      item.price * item.quantity
    }`;
  });

  return [
    `Order: #${order._id.toString().slice(-6)}`,
    `Customer: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Email: ${order.customer.email}`,
    `Address: ${order.customer.address}`,
    `Status: ${order.status}`,
    "Items:",
    ...items,
    `Total: ₹${order.totalAmount}`,
  ];
}

async function sendOrderConfirmation(order) {
  console.log("📦 TELEGRAM: sendOrderConfirmation called");

  const message = [
    "🛒 NEW ORDER RECEIVED",
    "",
    ...getOrderDetails(order),
  ].join("\n");

  return sendTelegramMessage(message);
}

async function sendOrderStatusUpdate(order) {
  console.log("📦 TELEGRAM: sendOrderStatusUpdate called");

  const message = [
    "📦 ORDER STATUS UPDATE",
    "",
    ...getOrderDetails(order),
  ].join("\n");

  return sendTelegramMessage(message);
}

async function sendFeedbackNotification(feedback) {
  const message = [
    "📩 NEW WEBSITE MESSAGE",
    "",
    `Type: ${feedback.type}`,
    `Name: ${feedback.name || "Not provided"}`,
    `Email: ${feedback.email || "Not provided"}`,
    "",
    feedback.message,
  ].join("\n");

  return sendTelegramMessage(message);
}

module.exports = {
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendFeedbackNotification,
};