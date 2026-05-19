function safeJsonParse(raw) {
  const cleaned = String(raw || "")
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI returned invalid JSON.");
    return JSON.parse(match[0]);
  }
}

function getLanguageInstruction(language) {
  const instructions = {
    en: "Write all user-facing JSON values in English.",
    ms: "Write all user-facing JSON values in Bahasa Melayu.",
    zh: "Write all user-facing JSON values in Simplified Chinese."
  };

  return instructions[language] || instructions.en;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64, language = "en" } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No screenshot uploaded." });
    }

    const languageInstruction = getLanguageInstruction(language);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        temperature: 0,
        max_completion_tokens: 1000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `
You are ScamShield Malaysia.

Analyze this uploaded screenshot for scam indicators.

${languageInstruction}

Important:
- Read the visible text in the screenshot.
- Identify whether it looks like a scam, possible scam, or looks safe.
- If text is blurry or incomplete, say so in the summary.
- JSON keys must remain in English.
- The verdict value must be exactly one of:
  "LIKELY SCAM", "POSSIBLE SCAM", "LOOKS SAFE"

Return ONLY valid raw JSON:
{
  "verdict": "LIKELY SCAM" or "POSSIBLE SCAM" or "LOOKS SAFE",
  "riskScore": number 0-100,
  "summary": "1-2 sentence summary",
  "redFlags": ["flag1", "flag2"],
  "whatToDo": ["action1", "action2"],
  "scamType": "type of scam or null",
  "officialLinks": [{"label":"label","url":"url"}]
}

Use Malaysian context where relevant:
- OTP scams
- parcel scams
- fake investment schemes
- fake bank alerts
- Macau scams
- fake job scams
- e-wallet scams

Relevant official resources:
- PDRM: https://www.rmp.gov.my/
- BNM: https://www.bnm.gov.my/
- MCMC: https://aduan.skmm.gov.my/
- Semak Mule: https://semakmule.rmp.gov.my/
`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Screenshot analysis failed."
      });
    }

    const raw = data.choices?.[0]?.message?.content;
    if (!raw) {
      return res.status(500).json({ error: "No response returned from vision model." });
    }

    const parsed = safeJsonParse(raw);
    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
