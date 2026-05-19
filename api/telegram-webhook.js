export default async function handler(req, res) {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    const incomingText = req.body.message?.text;
    const chat_id = req.body.message?.chat?.id;

    if (!incomingText || !chat_id) {
      return res.status(200).json({
        ok: true,
        message: "No valid Telegram message received."
      });
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
Risk: ${result.riskScore}/100
Confidence: ${result.confidence || 0}%

Summary:
${result.summary}

Scam Type:
${result.scamType || "Unknown"}
`
      })
    });

    return res.status(200).json({
      ok: true
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
