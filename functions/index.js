const functions = require("firebase-functions");
const axios = require("axios");


const MODEL_NAME = process.env.MODEL_NAME || "gemini-1.5-pro";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;


exports.helloWorld = functions.https.onRequest((req, res) => {
  res.send("Hello from Firebase!");
});


exports.checkNewsGemini = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") return res.status(405).send("Method not allowed");

    const { text, url, lang } = req.body || {};
    if (!text || typeof text !== "string") return res.status(400).json({ error: "Missing text" });

    if (!GEMINI_API_KEY) {
      console.error("GEMINI key not configured");
      return res.status(500).json({ error: "Server misconfigured" });
    }

    const prompt = `
You are a fact-checking assistant. Analyze the following news text and return a JSON object only (no extra explanation).
Respond in ${lang === "en" ? "English" : "Arabic"}.

Input:
"""${text}"""

Return JSON with keys:
  - classification: "true" or "fake"
  - trust_score: integer between 0 and 100
  - classification_reason: short text explanation
  - alternative_sources: array of {title, url}
  - fact_check: array of {claim, publisher, url}
`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta2/models/${encodeURIComponent(MODEL_NAME)}:generateContent`;

    const r = await axios.post(endpoint, {
      prompt: { text: prompt },
      temperature: 0.2,
      maxOutputTokens: 800,
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GEMINI_API_KEY}`
      },
      timeout: 60000
    });

    
    const raw = r.data;
    let modelText = "";
    if (raw?.candidates && raw.candidates[0]?.content) modelText = raw.candidates[0].content;
    else if (raw?.output?.[0]?.content) modelText = raw.output[0].content;
    else if (raw?.content) modelText = String(raw.content);
    else modelText = JSON.stringify(raw).slice(0, 2000);

    let parsed = null;
    try { parsed = JSON.parse(modelText); }
    catch (e) {
      const jmatch = modelText.match(/\{[\s\S]*\}/);
      if (jmatch) {
        try { parsed = JSON.parse(jmatch[0]); } catch(e2){ parsed = null; }
      }
    }

    if (!parsed) {
      const lower = modelText.toLowerCase();
      const classification = lower.includes("fake") ? "fake" : (lower.includes("true") ? "true" : "unknown");
      parsed = {
        classification,
        trust_score: 60,
        classification_reason: modelText.substring(0, 400),
        alternative_sources: [],
        fact_check: []
      };
    }

    return res.json(parsed);

  } catch (err) {
    console.error("checkNewsGemini error:", err?.response?.data || err.message || err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
