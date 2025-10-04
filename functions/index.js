const {onRequest, onCall} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2/options");
const axios = require("axios");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");

setGlobalOptions({
  region: "us-central1",
  timeoutSeconds: 300,
  memory: "512MiB",
});

initializeApp();

const GEMINI_API_KEY = "AIzaSyA2eov2yTsbAaA8LNaN8hvtmmFAcLgcARo";
const MODEL_NAME = "gemini-2.0-flash";

exports.helloWorld = onRequest((req, res) => {
  res.send("Hello from Firebase!");
});

exports.analyzeNews = onCall(async (request) => {
  try {
    const {text, link, lang} = request.data || {};

    if (!text || typeof text !== "string") {
      throw new Error("invalid-argument: Missing or invalid text");
    }

    if (!GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY not configured");
      throw new Error("failed-precondition: Server misconfigured");
    }

    const prompt = `You are a professional fact-checking assistant. Analyze the following news text and return ONLY a valid JSON object (no extra text or explanation).
Respond in ${lang === "en" ? "English" : "Arabic"}.

Input text:
"""${text.substring(0, 2000)}"""

Required JSON format:
{
  "classification": "true" or "fake",
  "category": "political" or "sports" or "health" or "technology" or "economy" or "entertainment" or "science" or "education" or "environment" or "international" or "local" or "other",
  "trust_score": number between 0 and 100,
  "classification_reason": "brief explanation in ${lang === "en" ? "English" : "Arabic"}",
  "alternative_sources": [{"title": "source title", "url": "source url"}],
  "fact_check": [{"claim": "specific claim", "publisher": "publisher name", "url": "verification url"}]
}

IMPORTANT: Return ONLY the JSON object, no additional text.`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/` +
      `${encodeURIComponent(MODEL_NAME)}:generateContent?key=` +
      `${encodeURIComponent(GEMINI_API_KEY)}`;

    const r = await axios.post(endpoint, {
      contents: [{role: "user", parts: [{text: prompt}]}],
    }, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 60000,
    });

    let modelText = "";
    if (r.data && r.data.candidates && r.data.candidates[0] &&
        r.data.candidates[0].content && r.data.candidates[0].content.parts &&
        r.data.candidates[0].content.parts[0] &&
        r.data.candidates[0].content.parts[0].text) {
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
        try {
          parsed = JSON.parse(jmatch[0]);
        } catch (e2) {
          parsed = null;
        }
      }
    }

    if (!parsed) {
      const lower = modelText.toLowerCase();
      const classification = lower.includes("fake") ? "fake" :
          (lower.includes("true") ? "true" : "unknown");
      parsed = {
        classification,
        category: "other",
        trust_score: 60,
        classification_reason: modelText.substring(0, 400),
        alternative_sources: [],
        fact_check: [],
      };
    }

    try {
      const db = getFirestore();
      const analysisData = {
        text: text.substring(0, 1000),
        link: link || null,
        classification: parsed.classification,
        category: parsed.category || "other",
        trust_score: parsed.trust_score,
        classification_reason: parsed.classification_reason,
        alternative_sources: parsed.alternative_sources || [],
        fact_check: parsed.fact_check || [],
        timestamp: FieldValue.serverTimestamp(),
        user_id: request.auth ? request.auth.uid : null,
        ip_address: request.rawRequest ? request.rawRequest.ip : null,
      };

      await db.collection("news_analyses").add(analysisData);
      console.log("✅ Analysis saved to Firestore");
    } catch (saveError) {
      console.error("⚠️ Failed to save analysis:", saveError);
    }

    return parsed;
  } catch (err) {
    console.error("❌ analyzeNews error:",
        (err.response && err.response.data) || err.message || err);

    if (err.message.includes("invalid-argument")) {
      throw new Error("invalid-argument: " + err.message);
    } else if (err.message.includes("failed-precondition")) {
      throw new Error("failed-precondition: " + err.message);
    } else {
      throw new Error("internal: Internal Server Error - " +
          (err.message || "Unknown error"));
    }
  }
});

exports.getAnalytics = onCall(async (request) => {
  try {
    const db = getFirestore();

    const recentAnalyses = await db.collection("news_analyses")
        .orderBy("timestamp", "desc")
        .limit(100)
        .get();

    const analyses = [];
    let totalAnalyses = 0;
    let fakeCount = 0;
    let trueCount = 0;
    let totalTrustScore = 0;

    recentAnalyses.forEach((doc) => {
      const data = doc.data();
      analyses.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp ? data.timestamp.toDate() : null,
      });

      totalAnalyses++;
      if (data.classification === "fake") fakeCount++;
      if (data.classification === "true") trueCount++;
      if (data.trust_score) totalTrustScore += data.trust_score;
    });

    const averageTrustScore = totalAnalyses > 0 ?
        Math.round(totalTrustScore / totalAnalyses) : 0;

    return {
      totalAnalyses,
      fakeCount,
      trueCount,
      averageTrustScore,
      recentAnalyses: analyses.slice(0, 10),
    };
  } catch (err) {
    console.error("❌ getAnalytics error:", err);
    throw new Error("internal: Internal Server Error");
  }
});
