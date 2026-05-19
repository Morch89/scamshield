const TRUSTED_DOMAINS = [
  // ScamShield deployments
  "scamshield-malaysia.vercel.app",

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
  "nfcc.jpm.gov.my",
  "mycert.org.my",
  "mcmc.gov.my",
  "skmm.gov.my",

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
  "affinalways.com",
  "alliancebank.com.my",
  "bankrakyat.com.my",
  "bsn.com.my",
  "bankmuamalat.com.my",
  "alrajhibank.com.my",
  "standardchartered.com.my",
  "citibank.com.my",
  "kuwaitfinance.com.my",
  "agrobank.com.my",
  "mbsbbank.com",

  // E-wallets / payment
  "touchngo.com.my",
  "tngdigital.com.my",
  "grab.com",
  "boost.com.my",
  "bigpayme.com",
  "setel.com",
  "mae.com.my",

  // Shopping / logistics
  "shopee.com.my",
  "lazada.com.my",
  "pos.com.my",
  "jtexpress.my",
  "dhl.com",
  "fedex.com"
];

const SUSPICIOUS_DOMAIN_PATTERNS = [
  "secure",
  "verify",
  "reward",
  "claim",
  "bonus",
  "gift",
  "freecash",
  "touchngo",
  "tng",
  "maybank",
  "cimb",
  "kwsp",
  "bankislam",
  "pbebank",
  "reload",
  "otp",
  "parcel",
  "delivery"
];

function looksLikeImpersonation(url) {
  const hostname = getHostname(url);

  if (!hostname) return false;
  if (isTrustedUrl(url)) return false;

  return SUSPICIOUS_DOMAIN_PATTERNS.some((keyword) =>
    hostname.includes(keyword)
  );
}

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
      riskScore: 1,
      summary:
        "Ini ialah laman ujian rasmi ScamShield Malaysia 😄 Anda baru sahaja cuba menyemak laman scam checker itu sendiri.",
      redFlags: [],
      whatToDo: [
        "Teruskan menguji aplikasi ini dengan mesej scam yang mencurigakan.",
        "Pastikan anda sentiasa menyemak URL sebelum berkongsi maklumat sensitif."
      ],
      scamType: null,
      officialLinks: []
    };
  }

  if (language === "zh") {
    return {
      verdict: "LOOKS SAFE",
      riskScore: 1,
      summary:
        "这是 ScamShield Malaysia 的官方测试网站 😄 你刚刚尝试检查诈骗检测器本身。",
      redFlags: [],
      whatToDo: [
        "你可以继续使用可疑信息来测试此应用。",
        "在输入敏感资料之前，请务必确认网址正确。"
      ],
      scamType: null,
      officialLinks: []
    };
  }

  return {
    verdict: "LOOKS SAFE",
    riskScore: 1,
    summary:
      "This is the official ScamShield Malaysia testing site 😄 You just tried to scam-check the scam checker itself.",
    redFlags: [],
    whatToDo: [
      "Feel free to continue testing the app with suspicious messages.",
      "Always verify website URLs before entering sensitive information."
    ],
    scamType: null,
    officialLinks: []
  };
}
function getRuleBasedRisk(text, urls, suspiciousUrls) {

  let score = 0;
  const signals = [];

  function add(points, label) {
    score += points;
    signals.push(label);
  }

  if (suspiciousUrls.length > 0) {
  add(20, "Contains unknown or untrusted URL");
}

const impersonationUrls = suspiciousUrls.filter(looksLikeImpersonation);

if (impersonationUrls.length > 0) {
  add(35, "URL appears to impersonate a bank, wallet, parcel, or government service");
}

if (/(otp|tac|verification code|kod pengesahan|验证码|一次性密码|驗證碼|动态密码|动态验证码)/i.test(text)) {
  add(35, "Mentions OTP/TAC/verification code");
}

if (/(urgent|immediately|segera|limited time|account suspended|akaun digantung|digantung|secepat mungkin|紧急|立即|马上|立刻|账号被冻结|帳號被凍結|账户暂停|賬戶暫停)/i.test(text)) {
  add(15, "Uses urgent or threatening language");
}

if (/(maybank|cimb|tng|touch n go|kwsp|lhdn|hasil|pdrm|bank|银行|銀行|公积金|公積金|电子钱包|電子錢包)/i.test(text)) {
  add(15, "Mentions bank, wallet, or government brand");
}

if (/(click|klik|tekan|login|log in|verify|claim|tebus|redeem|update|kemas kini|点击|點擊|登入|登录|验证|驗證|领取|領取|更新|提交资料|提交資料)/i.test(text)) {
  add(15, "Asks user to click, login, verify, or claim");
}

if (/(apk|install app|download app|muat turun aplikasi|下载安装|下載安裝|安装应用|安裝應用|下载APP|下載APP)/i.test(text)) {
  add(40, "Asks user to download or install an app/APK");
}

if (/(investment|pelaburan|guaranteed return|profit|crypto|forex|投资|投資|稳赚|穩賺|高回酬|高回报|虚拟货币|虛擬貨幣)/i.test(text)) {
  add(25, "Mentions investment or guaranteed profit");
}

if (/(bit\.ly|tinyurl\.com|t\.co|goo\.gl|lihi\.cc|shorturl\.at|cutt\.ly)/i.test(text)) {
  add(30, "Uses shortened URL that hides the final destination");
}

  return {
    ruleScore: Math.min(score, 100),
    ruleSignals: signals
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
    const ruleRisk = getRuleBasedRisk(text, urls, suspiciousUrls);

    const textLower = text.toLowerCase();

    if (
      textLower.includes("scamshield-malaysia.vercel.app") ||
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

Rule-based scam signals detected:
Risk score from rules: ${ruleRisk.ruleScore}/100
Signals:
${ruleRisk.ruleSignals.length ? ruleRisk.ruleSignals.join("\n") : "No strong rule-based signals detected."}

Use these rule-based signals as supporting evidence.
Do not ignore them.
However, if the message is clearly safe, you may reduce the final score.

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

Scam category intelligence rules:
- scamType should be the specific scam type, such as "fake parcel delivery scam" or "OTP phishing".
- scamFamily should be the broader category.
- attackVector should describe the channel if clear.
- targetBrand should identify the impersonated brand, such as Maybank, CIMB, TNG, KWSP, Pos Laju, LHDN, PDRM, Shopee, or null.
- userRisk should describe what the scam is trying to steal or achieve.

Confidence transparency rules:
- confidence is how confident ScamShield is in the analysis, from 0 to 100.
- Use high confidence when there are strong signals like unknown URL, OTP request, impersonation, urgency, payment request, APK download, or fake parcel/bank wording.
- Use medium confidence when the message is suspicious but missing key evidence.
- Use low confidence when the message is incomplete, blurry, vague, or has too little context.
- confidenceReason must explain the confidence in simple user-friendly language.

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
  "confidence": number 0-100,
  "confidenceReason": "short explanation of how confident ScamShield is",
  "summary": "1-2 sentence plain language summary",
  "redFlags": ["flag1", "flag2"],
  "whatToDo": ["action1", "action2"],
  "scamType": "type of scam or null",
  "scamFamily": "Bank Impersonation or Parcel Scam or Investment Scam or Job Scam or E-wallet Scam or Government Aid Scam or Loan Scam or Tech Support Scam or Marketplace Scam or Phishing or Unknown or null",
  "attackVector": "SMS or WhatsApp or Email or Website or Phone Call or Social Media or Screenshot or Unknown",
  "targetBrand": "brand or organization being impersonated, or null",
  "userRisk": "Credential theft or OTP theft or Payment loss or Malware/APK install or Mule account risk or Personal data theft or Unknown or null",
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

const aiScore = Number(parsed.riskScore || 0);
const ruleScore = Number(ruleRisk.ruleScore || 0);

let finalScore = Math.round((aiScore * 0.4) + (ruleScore * 0.6));

if (ruleScore >= 50 && aiScore < 40) {
  finalScore = Math.max(finalScore, ruleScore);
}

parsed.riskScore = finalScore;
parsed.ruleSignals = ruleRisk.ruleSignals;
parsed.confidence = Number(parsed.confidence || finalScore || 0);

if (!parsed.confidenceReason) {
  parsed.confidenceReason =
    ruleRisk.ruleSignals.length > 0
      ? "Confidence is based on detected scam indicators such as suspicious wording, URLs, or impersonation patterns."
      : "Confidence is lower because there were few clear scam indicators.";
}

parsed.scamFamily = parsed.scamFamily || null;
parsed.attackVector = parsed.attackVector || "Unknown";
parsed.targetBrand = parsed.targetBrand || null;
parsed.userRisk = parsed.userRisk || null;
    
if (finalScore >= 75) {
  parsed.verdict = "LIKELY SCAM";
} else if (finalScore >= 40) {
  parsed.verdict = "POSSIBLE SCAM";
} else {
  parsed.verdict = "LOOKS SAFE";
}

return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
