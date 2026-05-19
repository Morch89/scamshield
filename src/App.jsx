import { useState } from "react";

const UI_TEXT = {
  en: {
    home: "Home",
    learn: "Learn More About Scams",
    headline: "Check suspicious messages before you click.",
    subtitle: "ScamShield Malaysia helps you check suspicious SMS, WhatsApp messages, bank alerts, parcel links, OTP requests, and fake prize claims.",
    responseLanguage: "Language",
    placeholder: "Paste the suspicious message or URL here...",
    checkButton: "Check for Scam",
    analysing: "Analysing...",
    counter: "Scam checks performed",
    privacy: "Privacy Policy",
    disclaimer: "Disclaimer"
  },
  ms: {
    home: "Laman Utama",
    learn: "Ketahui Lebih Lanjut Tentang Scam",
    headline: "Semak mesej mencurigakan sebelum anda klik.",
    subtitle: "ScamShield Malaysia membantu anda menyemak SMS, mesej WhatsApp, amaran bank, pautan parcel, permintaan OTP dan tuntutan hadiah palsu.",
    responseLanguage: "Bahasa",
    placeholder: "Tampal mesej atau pautan yang mencurigakan di sini...",
    checkButton: "Semak Scam",
    analysing: "Sedang menganalisis...",
    counter: "Semakan scam dibuat",
    privacy: "Polisi Privasi",
    disclaimer: "Penafian"
  },
  zh: {
    home: "主页",
    learn: "了解更多诈骗类型",
    headline: "点击之前，先检查可疑信息。",
    subtitle: "ScamShield Malaysia 可帮助你检查可疑短信、WhatsApp 信息、银行提醒、包裹链接、OTP 请求和虚假中奖信息。",
    responseLanguage: "语言",
    placeholder: "在这里粘贴可疑信息或链接...",
    checkButton: "检查诈骗",
    analysing: "分析中...",
    counter: "已完成诈骗检查",
    privacy: "隐私政策",
    disclaimer: "免责声明"
  }
};

const VERDICTS = {
  "LIKELY SCAM": { bg: "#FF3B30", light: "#FFF0EF", text: "#CC0000", icon: "⚠️" },
  "POSSIBLE SCAM": { bg: "#FF9500", light: "#FFF8EE", text: "#B35900", icon: "🔶" },
  "LOOKS SAFE": { bg: "#34C759", light: "#F0FFF4", text: "#1A7A33", icon: "✅" },
};

const scamCardStyle = {
  background: "rgba(255,255,255,0.04)",
  borderRadius: 20,
  border: "1px solid rgba(255,255,255,0.07)",
  padding: 24
};

const detailBoxStyle = {
  background: "rgba(0,0,0,0.24)",
  borderRadius: 16,
  padding: 18,
  marginBottom: 14
};

const footerButtonStyle = {
  background: "transparent",
  border: "none",
  color: "#7A8FA6",
  cursor: "pointer",
  fontSize: 12,
  textDecoration: "none"
};

const SCAM_TYPES = [
  {
    title: "💰 Fake Investment Schemes",
    desc: "Fake investment scams are among the most financially damaging scams in Malaysia. Scammers typically present themselves as experienced investment advisors, cryptocurrency experts, forex traders, or representatives of well-known financial companies. Victims are promised unusually high returns within a very short period of time, often with little or no risk involved. These scams commonly spread through WhatsApp groups, Telegram channels, Facebook advertisements, TikTok videos, and fake investment websites.\n\nScammers often use fabricated trading dashboards, fake profit screenshots, manipulated testimonials, and even impersonations of celebrities or public figures to appear legitimate. Victims may initially receive small ‘profits’ to build trust before being encouraged to invest larger amounts. Once significant funds are transferred, withdrawals become impossible, additional payments are demanded, or the scammers disappear entirely.\n\nMany of these operations are not licensed by financial authorities and victims usually have little chance of recovering their money after transfers are made.",
    example: "Earn RM15,000 in 7 days with our AI crypto trading platform. Limited slots available."
  },
  {
    title: "👮 Macau Scam",
    desc: "Macau scams involve highly organised criminal groups impersonating police officers, Bank Negara Malaysia officers, customs officials, court representatives, or courier companies. Victims are falsely informed that their bank accounts, phone numbers, or identities are linked to criminal activities such as money laundering, drug trafficking, tax evasion, or illegal financial transactions.\n\nScammers use fear and intimidation to pressure victims into cooperating immediately. Victims are often instructed not to tell anyone about the investigation because it is supposedly confidential. The scammers may transfer calls between multiple fake ‘departments’ to make the situation appear more convincing.\n\nEventually, victims are instructed to transfer money into so-called ‘safe accounts’ for investigation or verification purposes. In reality, these accounts belong to the scammers. Some victims are manipulated over several days and lose their entire savings due to fear of arrest or prosecution.",
    example: "Your bank account is linked to money laundering activities. Transfer your funds immediately for investigation."
  },
  {
    title: "📱 SMS & Email Phishing Scams",
    desc: "Phishing scams attempt to steal sensitive information such as banking usernames, passwords, OTP codes, credit card details, or identity information through fake SMS messages and emails. These messages are designed to look like official communications from banks, courier services, e-wallet providers, government agencies, or online platforms.\n\nVictims are usually directed to fake websites that closely resemble legitimate login portals. The scammers create urgency by claiming there is suspicious activity, account suspension, failed deliveries, refunds, or security verification requirements.\n\nOnce victims enter their details into these fake websites, scammers immediately use the information to access bank accounts, approve online transactions, or steal identities. Some phishing websites also install malware that can capture information directly from the victim’s device.",
    example: "Your CIMB account has been suspended. Verify immediately at cimb-secure-login.com"
  },
  {
    title: "💳 Non-Existent Loan Scams",
    desc: "Non-existent loan scams target individuals who urgently need financial assistance, especially those with poor credit histories or limited access to traditional banking loans. Scammers advertise easy approval loans with low interest rates and minimal documentation requirements.\n\nVictims are informed that their loan has been approved quickly, but before the funds can be released they must first pay processing fees, insurance fees, legal charges, stamp duty payments, or security deposits.\n\nAfter victims transfer the requested amount, scammers either continue demanding additional payments or disappear completely without providing any loan. Many victims continue paying because they believe the loan approval is genuine and fear losing the money they already paid.",
    example: "Your RM50,000 loan has been approved. Please pay RM800 processing fee to release funds."
  },
  {
    title: "❤️ Love Scam",
    desc: "Love scams involve scammers creating fake romantic relationships online through dating applications, Facebook, Instagram, Telegram, or other social media platforms. Scammers spend weeks or even months building emotional trust and convincing victims that the relationship is genuine.\n\nOnce trust is established, the scammer creates fake emergencies involving medical expenses, business problems, travel issues, customs charges, or family crises. Victims are emotionally manipulated into sending money repeatedly because they believe they are helping someone they love.\n\nSome scammers also claim they are sending expensive gifts or cash parcels that become ‘stuck at customs’, requiring victims to pay release fees. Victims often continue sending money even after multiple requests because the emotional attachment becomes extremely strong.",
    example: "I need help paying customs fees so I can send you the gifts and money parcel."
  },
  {
    title: "💼 Fake Job Scams",
    desc: "Fake job scams usually advertise attractive work-from-home opportunities, easy online tasks, or high-paying jobs requiring little experience. These scams often target students, unemployed individuals, and people seeking additional income.\n\nVictims are promised flexible hours, quick earnings, or commissions for simple tasks such as liking videos, rating products, or processing orders. After gaining the victim’s interest, scammers request registration fees, training fees, deposits, or payments to unlock higher-paying tasks.\n\nSome scams initially pay small amounts to gain trust before encouraging victims to deposit larger sums. Eventually, the scammers disappear, freeze withdrawals, or continuously demand more payments under different excuses.",
    example: "Earn RM300 daily from home with simple online tasks. Limited vacancies available."
  },
  {
    title: "🏦 Online Loan App Scams",
    desc: "Online loan app scams involve fake websites or mobile applications pretending to be legitimate financial institutions or licensed lenders. Victims are promised instant loan approvals with minimal documentation and fast cash disbursement.\n\nVictims are often asked to submit sensitive personal documents such as identity cards, selfies, bank statements, or salary slips. Scammers may misuse these documents for identity theft, unauthorised financial applications, or blackmail.\n\nSome victims are also pressured into paying upfront processing fees before the loan can supposedly be released. Once payment is made, the loan never arrives and the scammers become unreachable.",
    example: "Instant approval loan app. No documents required. Receive cash within 10 minutes."
  },
  {
    title: "📦 Parcel Scam",
    desc: "Parcel scams usually begin with calls, SMS messages, or WhatsApp notifications claiming that a parcel addressed to the victim has been detained by customs, courier companies, or authorities because it allegedly contains suspicious or illegal items.\n\nScammers create panic by mentioning drugs, fake documents, illegal goods, or unpaid customs fees. Victims are pressured into paying fines, verification charges, or providing personal information to ‘resolve’ the issue.\n\nIn some cases, the scam escalates into a Macau scam where fake police officers become involved and accuse the victim of participating in criminal activity. Victims who panic may end up transferring large amounts of money.",
    example: "Your parcel contains prohibited items. Pay immediately to avoid police investigation."
  },
  {
    title: "🏢 Organisation Impersonation Scams",
    desc: "These scams involve criminals pretending to represent banks, telecommunications companies, e-wallet providers, government agencies, delivery companies, or customer service departments. The scammers contact victims claiming there are issues with accounts, subscriptions, refunds, or verification requirements.\n\nVictims are often asked to provide sensitive information such as passwords, banking details, OTP codes, or identity card numbers. The scammers may use spoofed phone numbers, official-looking logos, and professional language to appear convincing.\n\nOnce enough information is collected, scammers use it to gain unauthorised access to bank accounts, digital wallets, or online services.",
    example: "Touch 'n Go eWallet account verification required. Submit your OTP now."
  },
  {
    title: "⚠️ Bank Account Threat Scams",
    desc: "Bank account threat scams rely heavily on fear and urgency. Victims are informed that their bank accounts are linked to suspicious transactions, unpaid taxes, criminal investigations, or illegal activities.\n\nScammers pressure victims into acting immediately by threatening account freezes, arrests, legal action, or court proceedings. Victims are instructed to transfer funds into temporary accounts for verification or safety purposes.\n\nBecause victims fear losing access to their accounts or facing legal consequences, they may comply without verifying the claims through official channels.",
    example: "Your account will be frozen within 2 hours unless you verify your funds immediately."
  },
  {
    title: "🎁 Government Aid Scams",
    desc: "Government aid scams exploit financial assistance programs and economic support announcements. Victims receive fake messages claiming they qualify for special government aid, subsidies, grants, or financial assistance.\n\nThe messages often contain fake links that imitate official portals. Victims are instructed to provide banking details, personal information, or pay small processing charges to receive the supposed aid.\n\nThese scams are especially common during periods of economic uncertainty, disasters, or government support initiatives when many people are actively seeking financial assistance.",
    example: "You qualify for RM1,500 bantuan khas. Verify now to receive payment."
  },
  {
    title: "🔐 OTP Scams",
    desc: "OTP scams occur when scammers trick victims into revealing one-time passwords sent by banks or digital services. Scammers commonly pretend to be bank officers, customer service agents, e-wallet support staff, or technical support representatives.\n\nVictims are told that the OTP is required to process refunds, verify accounts, stop suspicious activity, or complete updates. Once the victim shares the OTP, scammers immediately use it to authorise transactions, reset passwords, or gain access to financial accounts.\n\nMany victims mistakenly believe the OTP is only for verification purposes and do not realise they are approving actual transactions.",
    example: "We sent an OTP to verify your refund. Please provide the code immediately."
  },
  {
    title: "💸 Fake Fund Transfer Scam",
    desc: "In fake fund transfer scams, scammers falsely claim they accidentally transferred money into the victim’s account and urgently request the funds to be returned to another account.\n\nThe scammers may send fake banking screenshots or manipulated transaction notifications to make the transfer appear real. Victims who do not carefully verify their actual bank balances may end up transferring their own money to the scammer.\n\nThese scams rely on confusion, panic, and the victim’s willingness to ‘correct’ an apparent mistake quickly.",
    example: "I accidentally transferred RM2,000 into your account. Please return it urgently."
  },
  {
    title: "🖥️ Tech Support Scams",
    desc: "Tech support scams involve scammers impersonating representatives from Microsoft, antivirus companies, internet providers, or technical support teams. Victims are informed that their devices are infected with viruses, compromised by hackers, or experiencing security problems.\n\nScammers persuade victims to install remote access software that allows them to control the victim’s computer or mobile device. Once access is granted, scammers may steal passwords, banking information, personal files, or install malware.\n\nSome victims are also pressured into paying expensive ‘repair fees’ or fake software subscriptions for problems that never existed.",
    example: "Your computer has been infected with dangerous malware. Call support immediately."
  },
  {
    title: "🎫 Fake Ticket Scams",
    desc: "Fake ticket scams involve the sale of non-existent or invalid tickets for concerts, sporting events, theme parks, flights, or popular entertainment events through social media platforms and messaging applications.\n\nScammers usually claim they have limited tickets available at discounted prices or urgent last-minute sales. Victims are encouraged to make fast bank transfers to secure the tickets before they are supposedly sold out.\n\nAfter payment is made, victims either receive fake tickets, duplicated tickets that cannot be used, or nothing at all. The scammers typically disappear or block further communication immediately after receiving payment.",
    example: "Taylor Swift VIP tickets available cheap. Limited quantity, bank transfer only."
  }
];

function createDemoResult(input) {
  const lower = input.toLowerCase();
  const highRiskWords = ["otp", "password", "bank", "maybank", "cimb", "tng", "touch n go", "kwsp", "claim", "urgent", "verify", "prize", "parcel", "payment", "click", "link", "http"];
  const hits = highRiskWords.filter((word) => lower.includes(word));
  const score = Math.min(95, Math.max(25, hits.length * 14 + (lower.includes("http") ? 20 : 0)));

  if (score >= 70) {
    return {
      verdict: "LIKELY SCAM",
      riskScore: score,
      summary: "This message contains several scam indicators such as urgency, requests to click links, or references to banking/claims. Treat it as suspicious unless verified directly through official channels.",
      redFlags: [
        "It asks you to take action quickly or click a link.",
        "It may be impersonating a trusted Malaysian brand or authority.",
        "It could be trying to collect login, banking, or OTP information."
      ],
      whatToDo: [
        "Do not click the link or share personal details, passwords, or OTP codes.",
        "Contact the bank, courier, company, or authority using their official website or hotline.",
        "Check suspicious bank accounts using Semak Mule before making any payment."
      ],
      scamType: "Phishing / Impersonation Scam",
      officialLinks: [
        { label: "Semak Mule", url: "https://semak.mule.com.my/" },
        { label: "PDRM", url: "https://www.rmp.gov.my/" },
        { label: "BNM", url: "https://www.bnm.gov.my/" }
      ]
    };
  }

  if (score >= 40) {
    return {
      verdict: "POSSIBLE SCAM",
      riskScore: score,
      summary: "This message has some suspicious elements, but there is not enough information to confirm it is a scam. Verify it through official channels before responding.",
      redFlags: [
        "The message may be asking for action without enough context.",
        "There may be a link or request that should be verified first."
      ],
      whatToDo: [
        "Do not share sensitive details until you confirm the sender.",
        "Use official apps, websites, or phone numbers instead of links in the message."
      ],
      scamType: "Suspicious Message",
      officialLinks: [
        { label: "MCMC Complaint Portal", url: "https://aduan.skmm.gov.my/" },
        { label: "Semak Mule", url: "https://semak.mule.com.my/" }
      ]
    };
  }

  return {
    verdict: "LOOKS SAFE",
    riskScore: score,
    summary: "This message does not show strong scam indicators based on the text provided. Still be cautious if it asks for money, OTP codes, passwords, or personal information.",
    redFlags: [],
    whatToDo: [
      "Verify the sender if money or personal information is involved.",
      "Do not share OTP codes or passwords with anyone."
    ],
    scamType: null,
    officialLinks: [{ label: "Semak Mule", url: "https://semak.mule.com.my/" }]
  };
}

function RiskCircle({ score }) {
  const safeScore = Number.isFinite(Number(score)) ? Number(score) : 0;
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (safeScore / 100) * circ;
  const color = safeScore >= 70 ? "#FF3B30" : safeScore >= 40 ? "#FF9500" : "#34C759";

  return (
    <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 8px" }}>
      <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="#E5E5EA" strokeWidth="8" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "monospace", lineHeight: 1 }}>{safeScore}</span>
        <span style={{ fontSize: 10, color: "#8E8E93", fontWeight: 600, letterSpacing: "0.05em" }}>RISK</span>
      </div>
    </div>
  );
}

export default function ScamShield() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState("home");
  const [language, setLanguage] = useState("en");
  const t = UI_TEXT[language] || UI_TEXT.en;
  const [checkCount, setCheckCount] = useState(() => Number(localStorage.getItem("scamshield_checks") || 0));
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [sendingFeedback, setSendingFeedback] = useState(false);

  async function analyze() {
    const input = text.trim();

    if (!input) {
      setError("Please paste a suspicious message or URL first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/check-scam", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
  text: input,
  language
})
});

const data = await res.json();

if (!res.ok) {
  throw new Error(data.error || "Analysis failed.");
}

setResult(data);

      setCheckCount((current) => {
        const newCount = current + 1;
        localStorage.setItem("scamshield_checks", newCount);
        return newCount;
      });
    } catch (e) {
      setError("Analysis failed: " + e.message);
    }

    setLoading(false);
  }
async function submitFeedback() {
  if (!feedback.trim()) return;

  setSendingFeedback(true);

  try {
    await fetch("https://script.google.com/macros/s/AKfycbwrL8ZxIRO6h7QgrFRSSF4C9J-oKG0HGmyjozY3kST41DKXaIE0SuqUJTXFrotN__qaZg/exec", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain"
      },
      body: JSON.stringify({
        feedback
      })
    });

    setFeedback("");
    setFeedbackSent(true);

  } catch (err) {
    alert("Failed to send feedback.");
  }

  setSendingFeedback(false);
}
  function reset() {
    setResult(null);
    setText("");
    setError("");
  }

  const v = result ? VERDICTS[result.verdict] || VERDICTS["LOOKS SAFE"] : null;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#050d1a 0%,#0a1628 70%,#05120a 100%)", fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 60 }}>
      <div style={{ width: "100%", maxWidth: 760, padding: "24px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setPage("home")} style={{ background: page === "home" ? "linear-gradient(135deg,#00C864,#009950)" : "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.08)", padding: "10px 16px", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
              🛡️ {t.home}
            </button>

            <button onClick={() => setPage("learn")} style={{ background: page === "learn" ? "linear-gradient(135deg,#00C864,#009950)" : "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.08)", padding: "10px 16px", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
              📚 {t.learn}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#00C864,#009950)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 4px 20px rgba(0,200,100,0.35)" }}>🛡️</div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>ScamShield (Beta)</div>
            <div style={{ fontSize: 11, color: "#00C864", fontWeight: 700, letterSpacing: "0.12em" }}>MALAYSIA</div>
          </div>
        </div>

        <h1 style={{ color: "#fff", fontSize: 34, lineHeight: 1.12, margin: "20px 0 10px", letterSpacing: "-0.04em" }}>
          {t.headline}
        </h1>

        <p style={{ color: "#9AAFC5", fontSize: 15, margin: "0 0 18px", lineHeight: 1.7 }}>
          {t.subtitle}
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {["🇲🇾 Malaysia-focused", "⚡ Instant check", "🔒 No login needed", "🏛️ Official resources"].map((item, i) => (
            <span key={i} style={{ background: "rgba(0,200,100,0.12)", color: "#B8FFD8", border: "1px solid rgba(0,200,100,0.25)", borderRadius: 999, padding: "7px 11px", fontSize: 12, fontWeight: 700 }}>
              {item}
            </span>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 6 }}>
          {[
            ["1", "Paste", "Copy the suspicious message or link."],
            ["2", "Analyse", "Check for scam warning signs."],
            ["3", "Act", "Get clear next steps."]
          ].map((step, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 13 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#00C864", color: "#001A0B", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12, marginBottom: 8 }}>
                {step[0]}
              </div>

              <div style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>{step[1]}</div>
              <div style={{ color: "#7A8FA6", fontSize: 11, lineHeight: 1.5, marginTop: 4 }}>{step[2]}</div>
            </div>
          ))}
        </div>
      </div>

      {page === "home" && (
        <div style={{ width: "100%", maxWidth: 600, padding: "20px 20px 0" }}>
          {!result ? (
            <div style={scamCardStyle}>
              <div style={{ marginBottom: 12 }}>
  <label
    style={{
      color: "#7A8FA6",
      fontSize: 12,
      display: "block",
      marginBottom: 6
    }}
  >
    {t.responseLanguage}
  </label>

  <select
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
    style={{
      width: "100%",
      background: "rgba(0,0,0,0.3)",
      border: "1px solid rgba(255,255,255,0.09)",
      borderRadius: 12,
      padding: "12px 14px",
      color: "#E5E5EA",
      fontSize: 14,
      outline: "none"
    }}
  >
    <option value="en">English</option>
    <option value="ms">Bahasa Melayu</option>
    <option value="zh">简体中文</option>
  </select>
</div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t.placeholder}
                rows={8}
                style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "14px 16px", color: "#E5E5EA", fontSize: 14, fontFamily: "inherit", lineHeight: 1.65, resize: "none", outline: "none", boxSizing: "border-box" }}
              />

              {error && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(255,59,48,0.12)", borderRadius: 8, color: "#FF6B6B", fontSize: 13 }}>
                  {error}
                </div>
              )}

              <button onClick={analyze} disabled={loading || !text.trim()} style={{ width: "100%", marginTop: 14, padding: "15px 0", borderRadius: 12, fontSize: 15, fontWeight: 800, fontFamily: "inherit", border: "none", background: text.trim() && !loading ? "linear-gradient(135deg,#00C864,#009950)" : "rgba(0,200,100,0.2)", color: "#fff", cursor: text.trim() && !loading ? "pointer" : "not-allowed", boxShadow: text.trim() && !loading ? "0 4px 20px rgba(0,200,100,0.3)" : "none" }}>
                {loading ? t.analysing : t.checkButton}
              </button>

              <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>📊</span>
                  <div>
                    <div style={{ color: "#fff", fontSize: 16, fontWeight: 800 }}>{checkCount.toLocaleString()}</div>
                    <div style={{ color: "#7A8FA6", fontSize: 11 }}>{t.counter}</div>
                  </div>
                </div>
              </div>

              <p style={{ textAlign: "center", color: "#3D5166", fontSize: 11, marginTop: 12, lineHeight: 1.5 }}>
                ScamShield uses AI to assess risk. Results are advisory only. Always report to authorities if you suspect fraud.
              </p>
            </div>
          ) : (
            <div>
              <div style={{ borderRadius: 20, overflow: "hidden" }}>
                <div style={{ background: v.bg, padding: "20px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>VERDICT</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>{v.icon} {result.verdict}</div>
                </div>

                <div style={{ background: v.light, padding: 22 }}>
                  <RiskCircle score={result.riskScore} />

                  {result.scamType && (
                    <div style={{ textAlign: "center", marginBottom: 18 }}>
                      <span style={{ display: "inline-block", background: v.bg, color: "#fff", borderRadius: 20, padding: "4px 16px", fontSize: 12, fontWeight: 700 }}>{result.scamType}</span>
                    </div>
                  )}

                  <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: v.text, letterSpacing: "0.1em", marginBottom: 6 }}>SUMMARY</div>
                    <p style={{ margin: 0, fontSize: 15, color: "#1C1C1E", lineHeight: 1.65, fontWeight: 500 }}>{result.summary}</p>
                  </div>

                  {result.redFlags?.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#8E8E93", letterSpacing: "0.1em", marginBottom: 8 }}>🚩 WARNING SIGNS</div>
                      {result.redFlags.map((flag, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: "#fff", borderRadius: 10, marginBottom: 6, borderLeft: "3px solid #FF3B30" }}>
                          <span style={{ fontSize: 13 }}>⚡</span>
                          <span style={{ fontSize: 13, color: "#3A3A3C", lineHeight: 1.5 }}>{flag}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {result.whatToDo?.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#8E8E93", letterSpacing: "0.1em", marginBottom: 8 }}>✅ WHAT TO DO</div>
                      {result.whatToDo.map((action, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: "#fff", borderRadius: 10, marginBottom: 6, borderLeft: "3px solid #34C759" }}>
                          <span style={{ minWidth: 20, height: 20, background: "#34C759", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                          <span style={{ fontSize: 13, color: "#3A3A3C", lineHeight: 1.5 }}>{action}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {result.officialLinks?.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#8E8E93", letterSpacing: "0.1em", marginBottom: 8 }}>🏛️ OFFICIAL RESOURCES</div>
                      {result.officialLinks.map((link, i) => (
                        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", background: "#fff", borderRadius: 10, marginBottom: 6, border: "1px solid #E5E5EA", textDecoration: "none", color: "#007AFF", fontSize: 13, fontWeight: 600 }}>
                          <span>🔗 {link.label}</span>
                          <span>→</span>
                        </a>
                      ))}
                    </div>
                  )}

                  <div style={{ background: "linear-gradient(135deg,#050d1a,#0a1628)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                    <span style={{ fontSize: 26 }}>📞</span>
                    <div>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Scam Helpline: <span style={{ color: "#00C864" }}>997</span></div>
                      <div style={{ color: "#7A8FA6", fontSize: 12 }}>CCID Scam Response Centre</div>
                    </div>
                  </div>

                  <button onClick={reset} style={{ width: "100%", padding: "13px 0", borderRadius: 12, fontSize: 14, fontWeight: 700, fontFamily: "inherit", background: "transparent", border: "2px solid rgba(0,0,0,0.12)", color: "#3A3A3C", cursor: "pointer" }}>
                    Check Another Message
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 18, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16 }}>
                <div style={{ color: "#fff", fontWeight: 800, marginBottom: 6, fontSize: 15 }}>💬 Feedback & Suggestions</div>
                <div style={{ color: "#7A8FA6", fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>Help improve ScamShield by sharing feedback or reporting issues.</div>

                <textarea
  value={feedback}
  onChange={(e) => setFeedback(e.target.value)}
  placeholder="Share your feedback..."
  rows={4}
  style={{
    width: "100%",
    background: "rgba(0,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "12px 14px",
    color: "#fff",
    resize: "none",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box"
  }}
/>

               {!feedbackSent ? (
  <button
    onClick={submitFeedback}
    disabled={sendingFeedback || !feedback.trim()}
    style={{
      marginTop: 12,
      display: "inline-block",
      background: "linear-gradient(135deg,#00C864,#009950)",
      color: "#fff",
      border: "none",
      textDecoration: "none",
      padding: "10px 16px",
      borderRadius: 12,
      fontWeight: 700,
      fontSize: 13,
      cursor: sendingFeedback || !feedback.trim() ? "not-allowed" : "pointer",
      opacity: sendingFeedback || !feedback.trim() ? 0.6 : 1
    }}
  >
    {sendingFeedback ? "Sending..." : "Send Feedback"}
  </button>
) : (
  <div style={{ marginTop: 12, color: "#00C864", fontWeight: 700, fontSize: 13 }}>
    ✅ Thank you for your feedback!
  </div>
)}
              </div>

              <p style={{ textAlign: "center", color: "#3D5166", fontSize: 11, marginTop: 12, lineHeight: 1.6, padding: "0 8px" }}>
                ScamShield uses AI to assess risk. Results are advisory only. Always report to authorities if you suspect fraud.
              </p>
            </div>
          )}
        </div>
      )}

      {page === "learn" && (
        <div style={{ width: "100%", maxWidth: 760, padding: "20px" }}>
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 22, padding: 26 }}>
            <h2 style={{ color: "#fff", fontSize: 30, marginBottom: 8 }}>📚 Scam Education Centre</h2>

            <p style={{ color: "#8FA5BC", lineHeight: 1.7, marginBottom: 24 }}>
              Learn about common scams affecting Malaysians.
            </p>

            {SCAM_TYPES.map((item, i) => (
              <details key={i} style={detailBoxStyle}>
                <summary style={{ color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: 16 }}>
                  {item.title}
                </summary>

                <div style={{ marginTop: 14, color: "#C3D1DE", lineHeight: 1.75, fontSize: 14 }}>
                  {item.desc.split("\n\n").map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}

                  <strong style={{ color: "#fff" }}>Example:</strong>

                  <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 12, marginTop: 8, color: "#E5E5EA" }}>
                    “{item.example}”
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}   
            {page === "privacy" && (
        <div style={{ width: "100%", maxWidth: 760, padding: "20px" }}>
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 22,
            padding: 26,
            color: "#C3D1DE",
            lineHeight: 1.75,
            fontSize: 14
          }}>
            <h2 style={{ color: "#fff", fontSize: 30, marginBottom: 8 }}>
              {t.privacy}
            </h2>

            <p>
              ScamShield Malaysia is designed to help users check suspicious messages for possible scam indicators. This privacy policy explains how information may be handled when you use this website.
            </p>

            <h3 style={{ color: "#fff" }}>Information you provide</h3>
            <p>
              When you paste a message into the scam checker, the text is used to generate a scam risk result. In the current demo version, checks are processed locally in your browser and are not stored by us.
            </p>

            <h3 style={{ color: "#fff" }}>Local counter</h3>
            <p>
              The number of scam checks performed is stored locally in your browser using localStorage. This count is only visible on your device and is not a global public counter.
            </p>

            <h3 style={{ color: "#fff" }}>Feedback</h3>
            <p>
              If you submit feedback using the feedback button, your email application may open and send your message to life.alexchoo@gmail.com. Your email address and message content will be visible to the recipient.
            </p>

            <h3 style={{ color: "#fff" }}>Future AI processing</h3>
            <p>
              If ScamShield is connected to a live AI backend in the future, submitted messages may be sent to a third-party AI provider for analysis. You should avoid pasting sensitive personal information, passwords, OTP codes, banking details, or identity documents.
            </p>

            <h3 style={{ color: "#fff" }}>Contact</h3>
            <p>
              For privacy-related questions, contact: life.alexchoo@gmail.com
            </p>
          </div>
        </div>
      )}

      {page === "disclaimer" && (
        <div style={{ width: "100%", maxWidth: 760, padding: "20px" }}>
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 22,
            padding: 26,
            color: "#C3D1DE",
            lineHeight: 1.75,
            fontSize: 14
          }}>
            <h2 style={{ color: "#fff", fontSize: 30, marginBottom: 8 }}>
              {t.disclaimer}
            </h2>

            <p>
              ScamShield Malaysia provides general scam awareness and risk analysis for educational purposes only. The results are advisory and should not be treated as legal, financial, cybersecurity, banking, or law enforcement advice.
            </p>

            <h3 style={{ color: "#fff" }}>Accuracy</h3>
            <p>
              Scam detection results may not always be correct. A scam message may be missed, and a legitimate message may be flagged as suspicious. Always verify important matters through official channels.
            </p>

            <h3 style={{ color: "#fff" }}>User responsibility</h3>
            <p>
              Do not rely solely on ScamShield before making payments, sharing personal details, or responding to suspicious messages. Contact your bank, relevant company, or official authorities directly.
            </p>

            <h3 style={{ color: "#fff" }}>Urgent scam cases</h3>
            <p>
              If you believe you have been scammed, contact your bank immediately and call the National Scam Response Centre at 997 where applicable. You may also check suspicious bank accounts using Semak Mule.
            </p>

            <h3 style={{ color: "#fff" }}>No guarantee</h3>
            <p>
              ScamShield does not guarantee prevention of scams, recovery of funds, or complete accuracy of analysis.
            </p>
          </div>
        </div>
      )}   
      <div style={{
        marginTop: 30,
        display: "flex",
        gap: 16,
        justifyContent: "center",
        flexWrap: "wrap",
        color: "#5E7389",
        fontSize: 12
      }}>
        <button onClick={() => setPage("privacy")} style={footerButtonStyle}>
          Privacy Policy
        </button>

        <span style={{ color: "#3D5166" }}>•</span>

        <button onClick={() => setPage("disclaimer")} style={footerButtonStyle}>
          Disclaimer
        </button>
      </div>
    </div>
  );
}
