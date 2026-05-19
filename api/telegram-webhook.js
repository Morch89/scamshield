export default async function handler(req, res) {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    if (req.method !== "POST") {
      return res.status(200).json({
        ok: true,
        message: "Telegram webhook is live. Waiting for Telegram POST."
      });
    }

    const chat_id = req.body?.message?.chat?.id;

    if (!chat_id) {
      return res.status(200).json({
        ok: true,
        note: "No chat id",
        bodyPreview: req.body || null
      });
    }

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id,
        text: "✅ ScamShield bot received your message."
      })
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(200).json({
      ok: false,
      error: err.message
    });
  }
}
