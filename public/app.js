window.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("analyzeButton");
    console.log("زر:", btn); // هيظهر إذا الزر موجود أو null

    if (btn) {
        btn.addEventListener("click", async function() {
            const text = document.getElementById("q").value.trim();
            if (!text) {
                alert("⚠️ الرجاء إدخال نص الخبر أو الرابط!");
                return;
            }

            console.log("زر التحليل مضغوط!");

            try {
                // استدعاء Firebase Function
                const analyzeNews = firebase.functions().httpsCallable("analyzeNews");
                const response = await analyzeNews({ text, lang: "ar" });
                const result = response.data;

                // عرض النتيجة مباشرة على الصفحة
                let msg = "";
                if (result.classification === "true") {
                    msg = "✅ الخبر صحيح";
                } else if (result.classification === "fake") {
                    msg = "❌ الخبر مزيف";
                } else {
                    msg = `ℹ️ النتيجة: ${result.classification}`;
                }

                alert(msg); // ممكن لاحقاً نعرضها داخل div بدل alert
                console.log("تفاصيل:", result);

            } catch (err) {
                console.error("Error:", err);
                alert("🚨 حصل خطأ أثناء التحقق من الخبر!");
            }
        });
    } else {
        console.error("الزر analyzeButton مش موجود!");
    }
});

// ======================================
// استيراد مكتبات Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-functions.js";

// ======================================
// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCBHUJ5VMwhQMIpNQnVgweAh10rj-bzn0A",
  authDomain: "fake-new-explorerr.firebaseapp.com",
  projectId: "fake-new-explorerr",
  storageBucket: "fake-new-explorerr.firebasestorage.app",
  messagingSenderId: "803307691171",
  appId: "1:803307691171:web:141b6d2dcb40878f603316",
  measurementId: "G-DVWJVTY8XM"
};

// ======================================
// تهيئة Firebase
const app = initializeApp(firebaseConfig);
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
      const response = await analyzeNews({ text, link });
      const result = response.data.result; 

      // عرض النتيجة
      if (resultCard) {
        resultCard.style.display = "block";
        resultCard.classList.remove("success", "error");

        if (result === "true") {
          resultCard.textContent = "✅ الخبر صحيح";
          resultCard.classList.add("success");
        } else if (result === "false") {
          resultCard.textContent = "❌ الخبر مزيف";
          resultCard.classList.add("error");
        } else {
          resultCard.textContent = `ℹ️ النتيجة: ${result}`;
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
