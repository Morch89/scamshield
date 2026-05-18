import { useState } from "react";

const SYSTEM_PROMPT = `You are ScamShield Malaysia, a scam detection assistant for Malaysian users.
Analyze the content and assess whether it is a scam.
Respond ONLY with a valid JSON object in this exact format, no markdown, no backticks, just raw JSON:
{
  "verdict": "LIKELY SCAM" or "POSSIBLE SCAM" or "LOOKS SAFE",
  "riskScore": number 0-100,
  "summary": "1-2 sentence plain English summary",
  "redFlags": ["flag1", "flag2"],
  "whatToDo": ["action1", "action2"],
  "scamType": "type of scam or null",
  "officialLinks": [{"label": "label", "url": "url"}]
}
For officialLinks use real Malaysian authorities: PDRM https://www.rmp.gov.my/, BNM https://www.bnm.gov.my/, MCMC https://aduan.skmm.gov.my/, Semak Mule https://semak.mule.com.my/.
riskScore 0=safe 100=definite scam.
Write in clear plain English.
Always include at least one whatToDo action.
Always return raw JSON only.`;

const VERDICTS = {
  "LIKELY SCAM": { bg: "#FF3B30", light: "#FFF0EF", text: "#CC0000", icon: "⚠️" },
  "POSSIBLE SCAM": { bg: "#FF9500", light: "#FFF8EE", text: "#B35900", icon: "🔶" },
  "LOOKS SAFE": { bg: "#34C759", light: "#F0FFF4", text: "#1A7A33", icon: "✅" },
};

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
    officialLinks: [
      { label: "Semak Mule", url: "https://semak.mule.com.my/" }
    ]
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
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
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
      // IMPORTANT FOR PRODUCTION:
      // Do not call OpenAI directly from browser code with your real API key.
      // For Wix, call a Velo backend function instead. For Vercel/Netlify, call your own serverless API route.
      // This preview uses a local demo analyzer so you can test the UI safely.
      await new Promise((resolve) => setTimeout(resolve, 650));
      setResult(createDemoResult(input));

      /*
      Example production call to YOUR backend, not directly to OpenAI:

      const res = await fetch("/api/check-scam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed.");
      setResult(data);
      */
    } catch (e) {
      setError("Analysis failed: " + e.message);
    }

    setLoading(false);
  }

  function reset() {
    setResult(null);
    setText("");
    setError("");
  }

  const v = result ? VERDICTS[result.verdict] || VERDICTS["LOOKS SAFE"] : null;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#050d1a 0%,#0a1628 70%,#05120a 100%)", fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 60 }}>
      <div style={{ width: "100%", maxWidth: 600, padding: "40px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#00C864,#009950)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 4px 20px rgba(0,200,100,0.35)" }}>🛡️</div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>ScamShield</div>
            <div style={{ fontSize: 11, color: "#00C864", fontWeight: 700, letterSpacing: "0.12em" }}>MALAYSIA</div>
          </div>
        </div>
        <p style={{ color: "#7A8FA6", fontSize: 14, margin: "8px 0 0", lineHeight: 1.6 }}>
          Paste a suspicious message or link below. We will tell you if it looks like a scam.
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 600, padding: "20px 20px 0" }}>
        {!result ? (
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.07)", padding: 24 }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={"Paste the suspicious message or URL here...\n\nExamples:\n- Tahniah! Anda menang RM5,000 dari KWSP...\n- http://maybank-reward.com/claim\n- Your parcel is held, pay RM15 to release"}
              rows={8}
              style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "14px 16px", color: "#E5E5EA", fontSize: 14, fontFamily: "inherit", lineHeight: 1.65, resize: "none", outline: "none", boxSizing: "border-box" }}
            />

            {error ? (
              <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(255,59,48,0.12)", borderRadius: 8, color: "#FF6B6B", fontSize: 13 }}>
                {error}
              </div>
            ) : null}

            <button
              onClick={analyze}
              disabled={loading || !text.trim()}
              style={{ width: "100%", marginTop: 14, padding: "15px 0", borderRadius: 12, fontSize: 15, fontWeight: 800, fontFamily: "inherit", border: "none", background: text.trim() && !loading ? "linear-gradient(135deg,#00C864,#009950)" : "rgba(0,200,100,0.2)", color: "#fff", cursor: text.trim() && !loading ? "pointer" : "not-allowed", boxShadow: text.trim() && !loading ? "0 4px 20px rgba(0,200,100,0.3)" : "none" }}
            >
              {loading ? "Analysing..." : "Check for Scam"}
            </button>

            <p style={{ textAlign: "center", color: "#3D5166", fontSize: 11, marginTop: 12, lineHeight: 1.5 }}>
              Preview mode uses a demo analyzer. Connect your backend before going live.
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

                {result.scamType ? (
                  <div style={{ textAlign: "center", marginBottom: 18 }}>
                    <span style={{ display: "inline-block", background: v.bg, color: "#fff", borderRadius: 20, padding: "4px 16px", fontSize: 12, fontWeight: 700 }}>{result.scamType}</span>
                  </div>
                ) : null}

                <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: v.text, letterSpacing: "0.1em", marginBottom: 6 }}>SUMMARY</div>
                  <p style={{ margin: 0, fontSize: 15, color: "#1C1C1E", lineHeight: 1.65, fontWeight: 500 }}>{result.summary}</p>
                </div>

                {result.redFlags && result.redFlags.length > 0 ? (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#8E8E93", letterSpacing: "0.1em", marginBottom: 8 }}>🚩 WARNING SIGNS</div>
                    {result.redFlags.map((flag, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: "#fff", borderRadius: 10, marginBottom: 6, borderLeft: "3px solid #FF3B30" }}>
                        <span style={{ fontSize: 13 }}>⚡</span>
                        <span style={{ fontSize: 13, color: "#3A3A3C", lineHeight: 1.5 }}>{flag}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                {result.whatToDo && result.whatToDo.length > 0 ? (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#8E8E93", letterSpacing: "0.1em", marginBottom: 8 }}>✅ WHAT TO DO</div>
                    {result.whatToDo.map((action, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: "#fff", borderRadius: 10, marginBottom: 6, borderLeft: "3px solid #34C759" }}>
                        <span style={{ minWidth: 20, height: 20, background: "#34C759", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                        <span style={{ fontSize: 13, color: "#3A3A3C", lineHeight: 1.5 }}>{action}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                {result.officialLinks && result.officialLinks.length > 0 ? (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#8E8E93", letterSpacing: "0.1em", marginBottom: 8 }}>🏛️ OFFICIAL RESOURCES</div>
                    {result.officialLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", background: "#fff", borderRadius: 10, marginBottom: 6, border: "1px solid #E5E5EA", textDecoration: "none", color: "#007AFF", fontSize: 13, fontWeight: 600 }}
                      >
                        <span>🔗 {link.label}</span>
                        <span>→</span>
                      </a>
                    ))}
                  </div>
                ) : null}

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

            <p style={{ textAlign: "center", color: "#3D5166", fontSize: 11, marginTop: 12, lineHeight: 1.6, padding: "0 8px" }}>
              ScamShield uses AI to assess risk. Results are advisory only. Always report to authorities if you suspect fraud.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
