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

    // روابط القنوات لكل صنف
    const linksList = {
      "رياضي": ["https://www.espn.com", "https://www.skysports.com"],
      "سياسي": ["https://www.aljazeera.net", "https://www.bbc.com/arabic"],
      "اقتصادي": ["https://www.cnbc.com", "https://www.bloomberg.com"],
      "تكنولوجي": ["https://www.techcrunch.com", "https://www.theverge.com"],
      "صحي": ["https://www.webmd.com", "https://www.mayoclinic.org"],
      "ثقافي / فني": ["https://www.imdb.com", "https://www.billboard.com"],
      "بيئي / علمي": ["https://www.nationalgeographic.com", "https://www.sciencemag.org"],
      "ترفيهي / مشاهير": ["https://www.tmz.com", "https://www.people.com"],
      "تعليمي": ["https://www.edraak.org", "https://www.khanacademy.org"]
    };

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

      // عرض الروابط
      let linksHTML = "";
      if (linksList[category]) {
        linksHTML = "<ul>";
        for (let link of linksList[category]) {
          linksHTML += `<li><a href="${link}" target="_blank">${link}</a></li>`;
        }
        linksHTML += "</ul>";
      } else {
        linksHTML = "<p>❓ لم أتمكن من تحديد الصنف بدقة</p>";
      }

      resultDiv.innerHTML = `<h2>📌 التصنيف: ${category}</h2>${linksHTML}`;
    } catch (error) {
      resultDiv.innerHTML = `<p>⚠️ حدث خطأ: ${error}</p>`;
    }
  }