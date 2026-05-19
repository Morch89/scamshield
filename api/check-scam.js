const TRUSTED_DOMAINS = [
  // ScamShield deployments
  "scamshield-virid.vercel.app",
  "scamshield-umj6.vercel.app",

  // Malaysia government / official resources
  "gov.my",
  "rmp.gov.my",
  "bnm.gov.my",
  "aduan.skmm.gov.my",
  "semakmule.rmp.gov.my",
  "semak.mule.com.my",
  "hasil.gov.my",
  "kwsp.gov.my",
  "jpj.gov.my",
  "mof.gov.my",
  "malaysia.gov.my",
  "mysejahtera.malaysia.gov.my",

  // Banks / finance
  "maybank2u.com.my",
  "maybank.com",
  "cimb.com.my",
  "publicbank.com.my",
  "pbebank.com",
  "hongleongconnect.my",
  "rhbgroup.com",
  "bankislam.com",
  "ambank.com.my",
  "uob.com.my",
  "hsbc.com.my",
  "ocbc.com.my",

  // E-wallets / payment
  "touchngo.com.my",
  "tngdigital.com.my",
  "grab.com",
  "boost.com.my",

  // Shopping / logistics
  "shopee.com.my",
  "lazada.com.my",
  "pos.com.my",
  "jtexpress.my",
  "dhl.com",
  "fedex.com"
];

function extractUrls(text) {
  const regex = /(https?:\/\/[^\s]+)/g;
  return text.match(regex) || [];
}

function getHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function isTrustedUrl(url) {
  const hostname = getHostname(url);

  if (!hostname) return false;

  return TRUSTED_DOMAINS.some((domain) => {
    return hostname === domain || hostname.endsWith("." + domain);
  });
}

function hasOnlyTrustedUrls(urls) {
  if (urls.length === 0) return false;
  return urls.every(isTrustedUrl);
}

function safeJsonParse(raw) {
  const cleaned = String(raw || "")
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("AI returned invalid JSON.");
    }

    return JSON.parse(match[0]);
  }
}

function getLanguageInstruction(language) {
  const instructions = {
    en: `
OUTPUT LANGUAGE: English.
All user-facing JSON values must be in English only.
`,
    ms: `
OUTPUT LANGUAGE: Bahasa Melayu.
All user-facing JSON values must be in Bahasa Melayu only.
`,
    zh: `
OUTPUT LANGUAGE: Simplified Chinese.
All user-facing JSON values must be in Simplified Chinese only.
Use natural Simplified Chinese for Malaysia users.
`
  };

  return instructions[language] || instructions.en;
}

function getSafeResultForTrustedSite(language) {
  if (language === "ms") {
    return {
      verdict: "LOOKS SAFE",
      riskScore: 5,
      summary: "Pautan ini kelihatan seperti laman ScamShield yang telah dipercayai.",
      redFlags: [],
      whatToDo: [
        "Pastikan alamat laman web dieja dengan betul sebelum berkongsi maklumat sensitif.",
        "Jangan masukkan kata laluan, OTP atau maklumat perbankan jika anda tidak pasti."
      ],
      scamType: null,
      officialLinks: []
    };
  }

  if (language === "zh") {
    return {
      verdict: "LOOKS SAFE",
      riskScore: 5,
      summary: "此链接看起来是受信任的 ScamShield 网站。",
      redFlags: [],
      whatToDo: [
        "在输入任何敏感资料之前，请确认网址拼写正确。",
        "如果不确定，请不要输入密码、OTP 或银行资料。"
      ],
      scamType: null,
      officialLinks: []
    };
  }

  return {
    verdict: "LOOKS SAFE",
    riskScore: 5,
    summary: "This appears to be a trusted ScamShield website.",
    redFlags: [],
    whatToDo: [
      "Always verify that the website address is spelled correctly before entering sensitive information.",
      "Do not enter passwords, OTP codes, or banking details if you are unsure."
    ],
    scamType: null,
    officialLinks: []
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { text, language = "en" } = req.body;

    if (!text || text.trim().length < 5) {
      return res.status(400).json({
        error: "Please enter a message to check."
      });
    }

    const urls = extractUrls(text);
    const trustedUrls = urls.filter(isTrustedUrl);
    const suspiciousUrls = urls.filter((url) => !isTrustedUrl(url));

    const textLower = text.toLowerCase();

    if (
      textLower.includes("scamshield-virid.vercel.app") ||
      textLower.includes("scamshield-umj6.vercel.app")
    ) {
      return res.status(200).json(getSafeResultForTrustedSite(language));
    }

    const languageInstruction = getLanguageInstruction(language);

    const trustedContext =
      trustedUrls.length > 0
        ? `
Trusted URLs detected:
${trustedUrls.join("\n")}

These URLs are on the trusted whitelist.
Do NOT treat these trusted domains as suspicious by themselves.
Only flag the message if there are other strong scam indicators such as OTP requests, payment requests, impersonation, threats, or unrealistic investment returns.
`
        : "";

    const suspiciousUrlContext =
      suspiciousUrls.length > 0
        ? `
Untrusted or unknown URLs detected:
${suspiciousUrls.join("\n")}

Treat unknown links carefully, especially if combined with urgency, banking, OTP, payment, parcel, investment, or account suspension claims.
`
        : "";

    const allUrlsTrustedContext =
      hasOnlyTrustedUrls(urls)
        ? `
All URLs found in the message are trusted or official domains.
This should reduce the risk score unless the text itself contains very strong scam indicators.
`
        : "";

    const systemPrompt = `
You are ScamShield Malaysia, a scam detection assistant for Malaysian users.

${languageInstruction}

Important language rules:
- The selected output language overrides the input message language.
- If the suspicious message is in English but selected language is zh, respond in Simplified Chinese.
- If the suspicious message is in English but selected language is ms, respond in Bahasa Melayu.
- JSON keys must remain in English.
- Only these JSON values must follow the selected language:
  summary, redFlags, whatToDo, scamType, officialLinks.label
- The verdict value must stay exactly one of:
  "LIKELY SCAM", "POSSIBLE SCAM", "LOOKS SAFE"

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
- fake loan scams
- fake ticket scams
- tech support scams

Whitelist and URL context:
${trustedContext}
${suspiciousUrlContext}
${allUrlsTrustedContext}

Return ONLY valid raw JSON.
Do not use markdown.
Do not use backticks.
Do not add explanation outside JSON.

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
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
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

    const parsed = safeJsonParse(raw);

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
