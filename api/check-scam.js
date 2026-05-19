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
  en: "OUTPUT LANGUAGE: English. All user-facing JSON values must be in English only.",
  ms: "OUTPUT LANGUAGE: Bahasa Melayu. All user-facing JSON values must be in Bahasa Melayu only.",
  zh: "OUTPUT LANGUAGE: Simplified Chinese. All user-facing JSON values must be in Simplified Chinese only."
}[language] || "OUTPUT LANGUAGE: English. All user-facing JSON values must be in English only.";

    const systemPrompt = `
You are ScamShield Malaysia, a scam detection assistant for Malaysian users.
Important:
The selected output language overrides the input message language.
If the suspicious message is in English but selected language is zh, respond in Simplified Chinese.
If the suspicious message is in English but selected language is ms, respond in Bahasa Melayu.

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
        model: "qwen/qwen3-32b",
        temperature: 0,
        max_completion_tokens: 1000,
        reasoning_format: "hidden",
       messages: [
  {
    role: "system",
    content: systemPrompt
  },
  {
    role: "user",
    content: `
SELECTED_OUTPUT_LANGUAGE: ${language}

Language rules:
- en = English only
- ms = Bahasa Melayu only
- zh = Simplified Chinese only
- Ignore the input message language.
- Follow SELECTED_OUTPUT_LANGUAGE only.
- JSON keys stay English.
- JSON values must follow selected language.

Suspicious message to analyse:
${text}
`
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

let parsed;

try {
  parsed = JSON.parse(cleaned);
} catch {
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("AI returned invalid JSON.");
  }
  parsed = JSON.parse(match[0]);
}

return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
