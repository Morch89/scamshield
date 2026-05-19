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
  en: `
You MUST write all user-facing response values in English.
Even if the input message is Malay, Chinese, or mixed language, the output values must be English.
`,
  ms: `
You MUST write all user-facing response values in Bahasa Melayu.
Even if the input message is English, Chinese, or mixed language, the output values must be Bahasa Melayu.
`,
  zh: `
You MUST write all user-facing response values in Simplified Chinese.
Even if the input message is English, Malay, or mixed language, the output values must be Simplified Chinese.
`
}[language] || `
You MUST write all user-facing response values in English.
`;

    const systemPrompt = `
You are ScamShield Malaysia, a scam detection assistant for Malaysian users.

${languageInstruction}

Analyze suspicious messages for Malaysian scam patterns such as:
- phishing
- fake bank alerts
- OTP theft
- parcel scams
- Macau scams
- fake investment schemes
- government aid scams
- fake job scams
- e-wallet scams

Return ONLY valid raw JSON.
Do not use markdown.
Do not use backticks.
The JSON keys must remain in English.
Only these JSON values must follow the selected language:
- summary
- redFlags
- whatToDo
- scamType
- officialLinks.label

Do not follow the input message language. Follow the selected language only.

Required JSON format:
{
  "verdict": "LIKELY SCAM" or "POSSIBLE SCAM" or "LOOKS SAFE",
  "riskScore": number 0-100,
  "summary": "1-2 sentence plain language summary",
  "redFlags": ["flag1", "flag2"],
  "whatToDo": ["action1", "action2"],
  "scamType": "type of scam or null",
  "officialLinks": [{"label":"label","url":"url"}]
}

Use only these official Malaysian resources when relevant:
- PDRM: https://www.rmp.gov.my/
- BNM: https://www.bnm.gov.my/
- MCMC: https://aduan.skmm.gov.my/
- Semak Mule: https://semakmule.rmp.gov.my/
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0,
        max_completion_tokens: 900,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Analyze this message:\n\n${text}`
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Groq API request failed"
      });
    }

    const raw = data.choices?.[0]?.message?.content;

    if (!raw) {
      return res.status(500).json({
        error: "No response returned from Groq."
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
