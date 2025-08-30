import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-functions.js";

// Firebase Config 
const firebaseConfig = {
  apiKey: "AIzaSyCBHUJ5VMwhQMIpNQnVgweAh10rj-bzn0A",
  authDomain: "fake-new-explorerr.firebaseapp.com",
  projectId: "fake-new-explorerr",
  storageBucket: "fake-new-explorerr.firebasestorage.app",
  messagingSenderId: "803307691171",
  appId: "1:803307691171:web:141b6d2dcb40878f603316",
  measurementId: "G-DVWJVTY8XM"
};


const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

const checkBtn = document.getElementById("checkBtn");
const resultCard = document.getElementById("resultCard");

const checkNews = httpsCallable(functions, "checkNews");

checkBtn.addEventListener("click", async () => {
  const text = document.getElementById("newsText").value.trim();
  const link = document.getElementById("newsUrl").value.trim();

  if (!text && !link) {
    alert("⚠️ الرجاء إدخال نص الخبر أو الرابط!");
    return;
  }

  try {
    const response = await checkNews({ text, link });
    const result = response.data.result; 

    resultCard.style.display = "block";
    resultCard.classList.remove("success", "error");

    if (result === "true") {
      resultCard.textContent = "✅ الخبر صحيح";
      resultCard.classList.add("success");
    } else {
      resultCard.textContent = "❌ الخبر مزيف";
      resultCard.classList.add("error");
    }
  } catch (err) {
    console.error(err);
    alert("🚨 حصل خطأ أثناء التحقق من الخبر!");
  }
});