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
    en: "Extract all visible text exactly as shown. Use English labels only.",
    ms: "Extract all visible text exactly as shown. Use Bahasa Melayu labels where needed.",
    zh: "Extract all visible text exactly as shown. Use Simplified Chinese labels where needed."
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
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `
You are ScamShield Malaysia.

You are an OCR engine.

Your primary task is to copy every readable word from the screenshot exactly as shown.

Rules:
- Do NOT summarize.
- Do NOT explain.
- Do NOT decide if it is a scam.
- Preserve URLs exactly.
- Preserve phone numbers exactly.
- Preserve spelling mistakes exactly.
- Read small text carefully.
- If text is partially unreadable, still extract the visible parts.

${languageInstruction}

Important:
- Read all visible text in the screenshot.
- Preserve URLs exactly if visible.
- Extract phone numbers if visible.
- Extract bank names, wallet names, courier names, government agency names, and platform names if visible.
- Extract suspicious keywords such as OTP, TAC, verify, claim, reward, suspended, parcel, investment, job, loan, APK, login, password.
- If the screenshot is blurry or incomplete, lower the ocrConfidence.
- JSON keys must remain in English.

Return ONLY valid raw JSON:
{
  "extractedText": "exact full text copied from the screenshot, line by line",
  "urls": ["url1", "url2"],
  "phones": ["phone1", "phone2"],
  "brands": ["brand1", "brand2"],
  "keywords": ["keyword1", "keyword2"],
  "ocrConfidence": number 0-100
}
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
        error: data.error?.message || "Screenshot OCR failed."
      });
    }

    const raw = data.choices?.[0]?.message?.content;

    if (!raw) {
      return res.status(500).json({
        error: "No response returned from vision model."
      });
    }

    const ocrData = safeJsonParse(raw);
    return res.status(200).json({
  debug: true,
  ocrData
});
    if (!ocrData.extractedText || ocrData.extractedText.trim().length < 5) {
      return res.status(200).json({
  verdict: "POSSIBLE SCAM",
  riskScore: 50,
  summary: "The screenshot text could not be read clearly enough for a reliable analysis.",
  redFlags: ["Screenshot text is unclear or incomplete"],
  whatToDo: ["Upload a clearer screenshot or paste the message text directly."],
  scamType: null,
  officialLinks: [],
  source: "screenshot",
  ocrData: {
    extractedText: "",
    urls: [],
    phones: [],
    brands: [],
    keywords: [],
    ocrConfidence: 0
  }
});
    }

    const host = req.headers.host;
const protocol = host && host.includes("localhost") ? "http" : "https";
const baseUrl = `${protocol}://${host}`;
const combinedText = `
Screenshot OCR text:
${ocrData.extractedText || ""}

Detected URLs:
${(ocrData.urls || []).join("\n")}

Detected phones:
${(ocrData.phones || []).join("\n")}

Detected brands:
${(ocrData.brands || []).join(", ")}

Detected keywords:
${(ocrData.keywords || []).join(", ")}
`.trim();
const scamResponse = await fetch(`${baseUrl}/api/check-scam`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: combinedText,
        language,
        source: "screenshot"
      })
    });

    const scamRaw = await scamResponse.text();

let scamData;
try {
  scamData = JSON.parse(scamRaw);
} catch {
  return res.status(500).json({
    error: "Scam check endpoint did not return JSON.",
    rawPreview: scamRaw.slice(0, 200),
    calledUrl: `${baseUrl}/api/check-scam`
  });
}

    if (!scamResponse.ok) {
      return res.status(scamResponse.status).json({
        error: scamData.error || "Scam check failed after OCR.",
        ocrData
      });
    }

    return res.status(200).json({
  ...scamData,
  source: "screenshot",
  ocrData
});

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
