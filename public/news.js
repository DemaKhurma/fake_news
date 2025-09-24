async function getTextFromURL(url) {
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error("Proxy error");

    const data = await res.json();
    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents, "text/html");

    let extractedText = "";
    doc.body.querySelectorAll("*").forEach(el => {
      const text = el.textContent.trim();
      if (text.length > 30) extractedText += text + "\n";
    });

    return extractedText || null;
  } catch (err) {
    console.warn("❌ Failed to fetch URL:", err);
    return null; 
  }
}

async function classifyNews() {
  const input = document.getElementById("newsInput").value.trim();
  const resultDiv = document.getElementById("result");
  let newsContent = "";

  if (!input) {
    resultDiv.innerHTML = "<p>❌ الرجاء إدخال نص أو رابط.</p>";
    return;
  }

  if (input.startsWith("http://") || input.startsWith("https://")) {
    const fetchedText = await getTextFromURL(input);
    if (fetchedText && fetchedText.trim().length > 20) {
      newsContent = fetchedText;
    } else {
      newsContent = input;
    }
  } else {
    newsContent = input;
  }

  try {
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

    const category = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "غير معروف";

    resultDiv.innerHTML = `<h4> التصنيف: ${category}</h4>`;
  } catch (error) {
    resultDiv.innerHTML = `<p>⚠️ حدث خطأ: ${error}</p>`;
  }
}
