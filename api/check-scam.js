export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body;

    if (!text || text.trim().length < 5) {
      return res.status(400).json({
        error: "Please enter a message to check."
      });
    }

    const response = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1000,
          system: `
You are ScamShield Malaysia.

Return ONLY valid JSON.

{
  "verdict": "LIKELY SCAM" or "POSSIBLE SCAM" or "LOOKS SAFE",
  "riskScore": number 0-100,
  "summary": "1-2 sentence plain English summary",
  "redFlags": ["flag1", "flag2"],
  "whatToDo": ["action1", "action2"],
  "scamType": "type of scam or null",
  "officialLinks": [
    {"label":"PDRM","url":"https://www.rmp.gov.my/"},
    {"label":"BNM","url":"https://www.bnm.gov.my/"},
    {"label":"MCMC","url":"https://aduan.skmm.gov.my/"},
    {"label":"Semak Mule","url":"https://semak.mule.com.my/"}
  ]
}

Always return raw JSON only.
`,
          messages: [
            {
              role: "user",
              content: `Analyze this for scam indicators:\n\n${text}`
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Anthropic request failed"
      });
    }

    const raw =
      data.content?.map(x => x.text || "").join("").trim() || "";

    if (!raw) {
      return res.status(500).json({
        error: "Empty response from Anthropic"
      });
    }

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}