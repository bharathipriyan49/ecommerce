function normalizePhone(phone) {
  if (!phone) return null;

  const cleaned = String(phone).replace(/[^\d+]/g, "");

  if (!cleaned || cleaned === "+") {
    return null;
  }

  return cleaned;
}

async function sendCustomerOrderSMS(order) {
  const phone = order?.customer?.phone;
  const message = "Your order has been placed successfully and will reach you soon.";

  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone) {
    console.warn("📱 Local SMS skipped: customer phone number is missing");
    return { sent: false, skipped: true, reason: "missing_phone" };
  }

  const provider = (process.env.SMS_PROVIDER || "local").toLowerCase();

  try {
    if (provider === "twilio") {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const fromNumber = process.env.TWILIO_PHONE_NUMBER;

      if (!accountSid || !authToken || !fromNumber) {
        console.warn("📱 Twilio SMS skipped: credentials are not configured");
        return { sent: false, skipped: true, reason: "missing_twilio_config" };
      }

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: normalizedPhone,
            From: fromNumber,
            Body: message,
          }).toString(),
        }
      );

      const result = await response.text();

      if (!response.ok) {
        throw new Error(`Twilio SMS failed (${response.status}): ${result}`);
      }

      console.log("✅ SMS sent via Twilio to:", normalizedPhone);
      return { sent: true, skipped: false, provider: "twilio" };
    }

    if (provider === "smslocal") {
      const apiKey = process.env.SMSLOCAL_API_KEY || process.env.SMSLOCAL_KEY;
      const username = process.env.SMSLOCAL_USERNAME;
      const password = process.env.SMSLOCAL_PASSWORD;
      const sender = process.env.SMSLOCAL_SENDER || process.env.SMSLOCAL_SENDER_ID || "MyShop";
      const endpoint = process.env.SMSLOCAL_ENDPOINT || "https://api.smslocal.com/send";

      if (!apiKey && (!username || !password)) {
        console.warn("📱 SMSLocal SMS skipped: credentials are not configured");
        return { sent: false, skipped: true, reason: "missing_smslocal_config" };
      }

      const body = new URLSearchParams({
        numbers: normalizedPhone,
        message,
        sender,
      });

      if (apiKey) {
        body.append("apikey", apiKey);
      }

      if (username) {
        body.append("username", username);
      }

      if (password) {
        body.append("password", password);
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      const resultText = await response.text();

      if (!response.ok) {
        throw new Error(`SMSLocal API failed (${response.status}): ${resultText}`);
      }

      let parsed;
      try {
        parsed = JSON.parse(resultText);
      } catch {
        parsed = null;
      }

      if (parsed && parsed.status === "error") {
        throw new Error(parsed.message || "SMSLocal API returned an error");
      }

      console.log("✅ SMS sent via SMSLocal to:", normalizedPhone);
      return { sent: true, skipped: false, provider: "smslocal" };
    }

    console.log(`📱 LOCAL SMS -> ${normalizedPhone}: ${message}`);
    return { sent: true, skipped: false, provider: "local" };
  } catch (error) {
    console.error("❌ Customer SMS failed:", error.message);
    throw error;
  }
}

module.exports = {
  sendCustomerOrderSMS,
  normalizePhone,
};
