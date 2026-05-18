export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text, language = "en" } = req.body;

    if (!text || text.trim().length < 5) {
      return res.status(400).json({
        error: "Please enter a message to check."
      });
    }
const languageInstruction = {
  en: "Respond in English.",
  ms: "Respond in Bahasa Melayu.",
  zh: "Respond in Simplified Chinese."
}[language] || "Respond in English.";
    const prompt = `
You are ScamShield Malaysia.

${languageInstruction}

Analyze the message below and determine scam risk.

Return ONLY valid raw JSON.
Do not use markdown.
Do not use backticks.

The JSON keys must remain in English.
Only translate the values.

Format:
{
  "verdict": "LIKELY SCAM" or "POSSIBLE SCAM" or "LOOKS SAFE",
  "riskScore": number 0-100,
  "summary": "1-2 sentence plain English summary",
  "redFlags": ["flag1", "flag2"],
  "whatToDo": ["action1", "action2"],
  "scamType": "type of scam or null",
  "officialLinks": [
    {
      "label": "label",
      "url": "url"
    }
  ]
}

Use real Malaysian resources:
- https://semakmule.rmp.gov.my/
- https://www.rmp.gov.my/
- https://www.bnm.gov.my/
- https://aduan.skmm.gov.my/

Message:
${text}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          data.error?.message ||
          "Gemini API request failed"
      });
    }

    const raw =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!raw) {
      return res.status(500).json({
        error: "No response returned from Gemini."
      });
    }

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return res.status(200).json(JSON.parse(cleaned));

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
