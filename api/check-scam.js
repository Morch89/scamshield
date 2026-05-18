export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: `You are ScamShield Malaysia. Return only valid JSON:
{
  "verdict": "LIKELY SCAM" or "POSSIBLE SCAM" or "LOOKS SAFE",
  "riskScore": number 0-100,
  "summary": "short summary",
  "redFlags": ["flag"],
  "whatToDo": ["action"],
  "scamType": "type or null",
  "officialLinks": [{"label":"label","url":"url"}]
}`
        },
        {
          role: "user",
          content: `Analyze this for scam indicators:\n\n${text}`
        }
      ],
      text: {
        format: {
          type: "json_object"
        }
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    return res.status(500).json({ error: data.error?.message || "OpenAI request failed" });
  }

  return res.status(200).json(JSON.parse(data.output_text));
}