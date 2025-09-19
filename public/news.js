async function getTextFromURL(url) {
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  const res = await fetch(proxyUrl);
  const data = await res.json();

  const parser = new DOMParser();
  const doc = parser.parseFromString(data.contents, "text/html");

  let extractedText = "";
  doc.querySelectorAll("h1, h2, h3, p").forEach(el => {
    extractedText += el.textContent + "\n";
  });

  return extractedText;
}

// دالة التصنيف
async function classifyNews() {
  const input = document.getElementById("q").value.trim();
  const resultDiv = document.getElementById("result");
  let newsContent = "";

  if (!input) {
    resultDiv.innerHTML = "<p>❌ الرجاء إدخال نص أو رابط.</p>";
    return;
  }

  // إذا كان الإدخال رابط
  if (input.startsWith("http://") || input.startsWith("https://")) {
    try {
      newsContent = await getTextFromURL(input);
      if (!newsContent) newsContent = input; // fallback
    } catch (err) {
      resultDiv.innerHTML = "<p>❌ خطأ عند جلب الرابط.</p>";
      return;
    }
  } else {
    newsContent = input; // نص مباشر
  }

  try {
    // استدعاء Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyA2eov2yTsbAaA8LNaN8hvtmmFAcLgcARo",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `صنّف هذا الخبر إلى فئة واحدة فقط من القائمة التالية:
                  (رياضي، سياسي، اقتصادي، تكنولوجي، صحي، ثقافي / فني، بيئي / علمي، ترفيهي / مشاهير، تعليمي).
                  يجب أن يكون الجواب فقط اسم الفئة:\n\n${newsContent}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("🔍 API Response:", data);

    // قراءة التصنيف
    const category = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "غير معروف";

    // عرض التصنيف فقط
    resultDiv.innerHTML = `<h4> التصنيف: ${category}</h4>`;
  } catch (error) {
    resultDiv.innerHTML = `<p>⚠️ حدث خطأ: ${error}</p>`;
  }
}
