export default async function handler(req, res) {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    if (req.method !== "POST") {
      return res.status(200).json({
        ok: true,
        message: "Telegram webhook is live."
      });
    }

const message = req.body?.message;

const incomingText = message?.text;
const photos = message?.photo;

const chat_id = message?.chat?.id;
    
const command = incomingText?.trim().toLowerCase();

if (command === "/start") {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id,
      text: `
🛡 Welcome to ScamShield Malaysia

Send me:
• suspicious messages
• suspicious links
• scam screenshots

I will analyse them instantly using AI + scam intelligence.
`
    })
  });

  return res.status(200).json({ ok: true });
}

if (command === "/help") {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id,
      text: `
📖 ScamShield Help

Send:
• suspicious SMS
• suspicious WhatsApp messages
• suspicious URLs
• scam screenshots

Examples:
• fake parcel scams
• OTP scams
• investment scams
• fake bank alerts

ScamShield will analyse the message and estimate scam risk.
`
    })
  });

  return res.status(200).json({ ok: true });
}

if (command === "/privacy") {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id,
      text: `
🔒 Privacy

ScamShield analyses submitted messages and screenshots for scam detection purposes.

Avoid sending:
• passwords
• banking PINs
• full IC/passport numbers

ScamShield is an AI assistant and may not always be accurate.
`
    })
  });

  return res.status(200).json({ ok: true });
}
    if (!chat_id) {
      return res.status(200).json({
        ok: true,
        note: "No chat id"
      });
    }
// PHOTO / SCREENSHOT FLOW
if (photos && photos.length > 0) {

  // Get highest resolution photo
  const largestPhoto = photos[photos.length - 1];
  const file_id = largestPhoto.file_id;

  // Get Telegram file path
  const fileRes = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${file_id}`
  );

  const fileData = await fileRes.json();

  const filePath = fileData.result?.file_path;

  if (!filePath) {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id,
        text: "Could not retrieve screenshot from Telegram."
      })
    });

    return res.status(200).json({ ok: true });
  }

  // Download image from Telegram
  const imageUrl =
    `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

  const imageRes = await fetch(imageUrl);

  const imageBuffer = Buffer.from(await imageRes.arrayBuffer());

  // Convert to base64
  const imageBase64 =
    `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;

  const host = req.headers.host;
  const protocol = host.includes("localhost") ? "http" : "https";

  const baseUrl = `${protocol}://${host}`;

  // Call screenshot API
  const screenshotRes = await fetch(
    `${baseUrl}/api/check-screenshot`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        imageBase64,
        language: "en"
      })
    }
  );

  const result = await screenshotRes.json();

  // Send Telegram reply
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id,
      text: `
🛡 ScamShield Malaysia

Verdict: ${result.verdict}
Risk Score: ${result.riskScore}/100
Confidence: ${result.confidence || 0}%

Category: ${result.scamFamily || "Unknown"}

Summary:
${result.summary}
`
    })
  });

  return res.status(200).json({
    ok: true,
    source: "telegram-photo"
  });
}
    // Ignore empty messages
    if (!incomingText) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id,
          text: "Please send a suspicious message for ScamShield to analyse."
        })
      });

      return res.status(200).json({ ok: true });
    }

    const host = req.headers.host;
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    // Call ScamShield API
    const scamRes = await fetch(`${baseUrl}/api/check-scam`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: incomingText,
        language: "en",
        source: "telegram"
      })
    });

    const result = await scamRes.json();

    // Send Telegram reply
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id,
        text: `
🛡 ScamShield Malaysia

Verdict: ${result.verdict}
Risk Score: ${result.riskScore}/100
Confidence: ${result.confidence || 0}%

Category: ${result.scamFamily || "Unknown"}
Target Brand: ${result.targetBrand || "Unknown"}
User Risk: ${result.userRisk || "Unknown"}

Summary:
${result.summary}

What To Do:
${(result.whatToDo || []).join("\n• ")}
`
      })
    });

    return res.status(200).json({
      ok: true
    });

  } catch (err) {
    return res.status(200).json({
      ok: false,
      error: err.message
    });
  }
}
