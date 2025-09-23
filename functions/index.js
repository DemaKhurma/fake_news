const functions = require("firebase-functions");
const axios = require("axios");

// قراءة القيم من Firebase Functions Config
const GEMINI_API_KEY = functions.config().gemini.key;
const MODEL_NAME = functions.config().gemini.model || "gemini-1.5-pro";

// دالة اختبار بسيطة
exports.helloWorld = functions.https.onRequest((req, res) => {
  res.send("Hello from Firebase!");
});

// دالة التحقق من الأخبار باستخدام Gemini
exports.analyzeNews = functions.https.onCall(async (data, context) => {
  try {
    const { text, link, lang } = data;

    if (!text || typeof text !== "string") {
      throw new functions.https.HttpsError("invalid-argument", "Missing or invalid text");
    }

    if (!GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY not configured");
      throw new functions.https.HttpsError("failed-precondition", "Server misconfigured");
    }

    // بناء البرومبت
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

    // استدعاء Gemini API
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL_NAME)}:generateContent`;

    const r = await axios.post(endpoint, {
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GEMINI_API_KEY}`
      },
      timeout: 60000
    });

    // استخراج النص من استجابة Gemini
    let modelText = "";
    if (r.data && r.data.candidates && r.data.candidates[0] && r.data.candidates[0].content && r.data.candidates[0].content.parts && r.data.candidates[0].content.parts[0] && r.data.candidates[0].content.parts[0].text) {
  modelText = r.data.candidates[0].content.parts[0].text;
} else {
  modelText = JSON.stringify(r.data).slice(0, 2000);
}

    // محاولة تحويل النص إلى JSON
    let parsed = null;
    try {
      parsed = JSON.parse(modelText);
    } catch (e) {
      const jmatch = modelText.match(/\{[\s\S]*\}/);
      if (jmatch) {
        try { parsed = JSON.parse(jmatch[0]); } catch (e2) { parsed = null; }
      }
    }

    // fallback إذا ما قدر يحلل JSON
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

    return parsed;

  } catch (err) {
    console.error("❌ analyzeNews error:", (err?.response?.data )|| err.message || err);
    throw new functions.https.HttpsError("internal", "Internal Server Error");
  }
});
