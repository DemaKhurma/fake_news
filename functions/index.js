const functions = require("firebase-functions");
const axios = require("axios");
const admin = require("firebase-admin");

// تهيئة Firebase Admin
admin.initializeApp();

// قراءة القيم من Firebase Functions Config أو Environment Variables
const GEMINI_API_KEY = functions.config().gemini?.key || process.env.GEMINI_API_KEY || "AIzaSyA2eov2yTsbAaA8LNaN8hvtmmFAcLgcARo";
const MODEL_NAME = functions.config().gemini?.model || process.env.GEMINI_MODEL || "gemini-1.5-pro";

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

    // حفظ النتيجة في Firestore
    try {
      const db = admin.firestore();
      const analysisData = {
        text: text.substring(0, 1000), // حفظ أول 1000 حرف فقط
        link: link || null,
        classification: parsed.classification,
        trust_score: parsed.trust_score,
        classification_reason: parsed.classification_reason,
        alternative_sources: parsed.alternative_sources || [],
        fact_check: parsed.fact_check || [],
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        user_id: context.auth?.uid || null,
        ip_address: context.rawRequest?.ip || null
      };

      await db.collection('news_analyses').add(analysisData);
      console.log("✅ Analysis saved to Firestore");
    } catch (saveError) {
      console.error("⚠️ Failed to save analysis:", saveError);
      // لا نرمي خطأ هنا لأن التحليل نجح
    }

    return parsed;

  } catch (err) {
    console.error("❌ analyzeNews error:", (err?.response?.data )|| err.message || err);
    throw new functions.https.HttpsError("internal", "Internal Server Error");
  }
});

// دالة لجلب إحصائيات التحليلات
exports.getAnalytics = functions.https.onCall(async (data, context) => {
  try {
    const db = admin.firestore();
    
    // جلب آخر 100 تحليل
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
      recentAnalyses: analyses.slice(0, 10) // آخر 10 تحليلات فقط
    };

  } catch (err) {
    console.error("❌ getAnalytics error:", err);
    throw new functions.https.HttpsError("internal", "Internal Server Error");
  }
});
