// ======================================
// استخدام Firebase (Modular) عبر التهيئة المشتركة
import { app } from "/firebase-init.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-functions.js";

const functions = getFunctions(app);

// ======================================
// جلب العناصر من الصفحة
const checkBtn = document.getElementById("checkBtn");
const resultCard = document.getElementById("resultCard");

// ======================================
// استدعاء الـ Cloud Function باسم analyzeNews
const analyzeNews = httpsCallable(functions, "analyzeNews");

// ======================================
// حدث عند الضغط على زر "تحقق"
if (checkBtn) {
  checkBtn.addEventListener("click", async () => {
    const text = document.getElementById("newsText").value.trim();
    const link = document.getElementById("newsUrl").value.trim();

    // التحقق من الإدخال
    if (!text && !link) {
      alert("⚠️ الرجاء إدخال نص الخبر أو الرابط!");
      return;
    }

    try {
      // إرسال البيانات إلى الـ Cloud Function
      const response = await analyzeNews({ text, link, lang: "ar" });
      const data = response?.data || {};
      // دوال مساعدة للتوافق مع أكثر من شكل استجابة
      const classification = data.classification || data.result || "unknown";

      // عرض النتيجة
      if (resultCard) {
        resultCard.style.display = "block";
        resultCard.classList.remove("success", "error");

        if (classification === "true") {
          resultCard.textContent = "✅ الخبر صحيح";
          resultCard.classList.add("success");
        } else if (classification === "false" || classification === "fake") {
          resultCard.textContent = "❌ الخبر مزيف";
          resultCard.classList.add("error");
        } else {
          resultCard.textContent = `ℹ️ النتيجة: ${classification}`;
        }
      }
    } catch (err) {
      console.error("Error:", err);
      alert("🚨 حصل خطأ أثناء التحقق من الخبر!");
    }
  });
}

// مثال آخر لاستخدام analyzeNews مباشرة
analyzeNews({ text: "هذا نص خبر تجريبي للتحقق", lang: "ar", link: "" })
  .then((result) => {
    console.log("Result:", result.data);
  })
  .catch((err) => {
    console.error("Error:", err);
  });