const {onRequest, onCall} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2/options");
const axios = require("axios");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");

// Global options (adjust region if needed)
setGlobalOptions({region: "us-central1", timeoutSeconds: 60, memory: "256MiB"});

initializeApp();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-pro";

exports.helloWorld = onRequest((req, res) => {
  res.send("Hello from Firebase!");
});


exports.analyzeNews = onCall(async (request) => {
  try {
    const { text, link, lang } = request.data || {};

    if (!text || typeof text !== "string") {
      throw new Error("invalid-argument: Missing or invalid text");
    }

    if (!GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY not configured");
      throw new Error("failed-precondition: Server misconfigured");
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

   
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL_NAME)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

    const r = await axios.post(endpoint, {
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    }, {
      headers: {
        "Content-Type": "application/json"
      },
      timeout: 60000
    });

    
    let modelText = "";
    if (r.data && r.data.candidates && r.data.candidates[0] && r.data.candidates[0].content && r.data.candidates[0].content.parts && r.data.candidates[0].content.parts[0] && r.data.candidates[0].content.parts[0].text) {
  modelText = r.data.candidates[0].content.parts[0].text;
} else {
  modelText = JSON.stringify(r.data).slice(0, 2000);
}

    
    let parsed = null;
    try {
      parsed = JSON.parse(modelText);
    } catch (e) {
      const jmatch = modelText.match(/\{[\s\S]*\}/);
      if (jmatch) {
        try { parsed = JSON.parse(jmatch[0]); } catch (e2) { parsed = null; }
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

    
    try {
      const db = getFirestore();
      const analysisData = {
        text: text.substring(0, 1000), // حفظ أول 1000 حرف فقط
        link: link || null,
        classification: parsed.classification,
        trust_score: parsed.trust_score,
        classification_reason: parsed.classification_reason,
        alternative_sources: parsed.alternative_sources || [],
        fact_check: parsed.fact_check || [],
        timestamp: FieldValue.serverTimestamp(),
        user_id: request.auth?.uid || null,
        ip_address: request.rawRequest?.ip || null
      };

      await db.collection('news_analyses').add(analysisData);
      console.log("✅ Analysis saved to Firestore");
    } catch (saveError) {
      console.error("⚠️ Failed to save analysis:", saveError);
     
    }

    return parsed;

  } catch (err) {
    console.error("❌ analyzeNews error:", (err?.response?.data )|| err.message || err);
    throw new Error("internal: Internal Server Error");
  }
});


exports.getAnalytics = onCall(async (request) => {
  try {
    const db = getFirestore();
    
    
    const recentAnalyses = await db.collection('news_analyses')
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();

    const analyses = [];
    let totalAnalyses = 0;
    let fakeCount = 0;
    let trueCount = 0;
    let totalTrustScore = 0;

    recentAnalyses.forEach(doc => {
      const data = doc.data();
      analyses.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || null
      });
      
      totalAnalyses++;
      if (data.classification === 'fake') fakeCount++;
      if (data.classification === 'true') trueCount++;
      if (data.trust_score) totalTrustScore += data.trust_score;
    });

    const averageTrustScore = totalAnalyses > 0 ? Math.round(totalTrustScore / totalAnalyses) : 0;

    return {
      totalAnalyses,
      fakeCount,
      trueCount,
      averageTrustScore,
      recentAnalyses: analyses.slice(0, 10) 
    };

  } catch (err) {
    console.error("❌ getAnalytics error:", err);
    throw new Error("internal: Internal Server Error");
  }
});
