
import { app } from "/firebase-init.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-functions.js";

const functions = getFunctions(app);

const checkBtn = document.getElementById("checkBtn");
const resultCard = document.getElementById("resultCard");


const analyzeNews = httpsCallable(functions, "analyzeNews");


if (checkBtn) {
  checkBtn.addEventListener("click", async () => {
    const text = document.getElementById("newsText").value.trim();
    const link = document.getElementById("newsUrl").value.trim();

   
    if (!text && !link) {
      alert("⚠️ الرجاء إدخال نص الخبر أو الرابط!");
      return;
    }

    try {
     
      const response = await analyzeNews({ text, link, lang: "ar" });
      const data = response?.data || {};
     
      const classification = data.classification || data.result || "unknown";

    
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


analyzeNews({ text: "هذا نص خبر تجريبي للتحقق", lang: "ar", link: "" })
  .then((result) => {
    console.log("Result:", result.data);
  })
  .catch((err) => {
    console.error("Error:", err);
  });