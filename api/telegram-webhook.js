export default async function handler(req, res) {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    if (req.method !== "POST") {
      return res.status(200).json({
        ok: true,
        message: "Telegram webhook is live."
      });
    }

    const incomingText = req.body?.message?.text;
    const chat_id = req.body?.message?.chat?.id;
    
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
