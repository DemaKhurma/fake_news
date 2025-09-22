const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const pageId = link.getAttribute("data-page");
    pages.forEach(p => p.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
  });
});

// التحكم في الأقسام
const sectionBoxes = document.querySelectorAll(".section-box");
const sectionTitle = document.getElementById("sectionTitle");
const singleSection = document.getElementById("single-section");

sectionBoxes.forEach(box => {
  box.addEventListener("click", () => {
    const sectionNumber = box.getAttribute("data-section");

    pages.forEach(p => p.classList.remove("active"));
    singleSection.classList.add("active");

    // قسم 1: تصنيف مجال الخبر
    if (sectionNumber === "1") {
      sectionTitle.textContent = "تصنيف مجال الخبر";

      singleSection.innerHTML = `
        <h1>تصنيف مجال الخبر</h1>
        <textarea id="newsText" placeholder="انسخ نص الخبر هنا"></textarea>
        <button id="classifyBtn">تصنيف</button>
        <div id="resultCard" class="card" style="display:none"></div>
      `;

      // عند الضغط على زر التصنيف
      const classifyBtn = document.getElementById("classifyBtn");
      classifyBtn.addEventListener("click", async () => {
        const text = document.getElementById("newsText").value.trim();

        if (!text) {
          alert("⚠️ الرجاء إدخال نص الخبر!");
          return;
        }

        try {
          // هنا تستدعي Firebase Function checkNews أو API خاصتك
          // في هذا المثال بنحاكي النتيجة
          const result = "اقتصاد"; // القيمة سترجع من السيرفر

          const resultCard = document.getElementById("resultCard");
          resultCard.style.display = "block";
          resultCard.textContent = `📰 مجال الخبر: ${result}`;
        } catch (err) {
          console.error(err);
          alert("🚨 حصل خطأ أثناء التصنيف!");
        }
      });
    } else {
      // باقي الأقسام العادية
      sectionTitle.textContent = `قسم ${sectionNumber}`;
      singleSection.innerHTML = `
        <h1>قسم ${sectionNumber}</h1>
        <p>هنا محتوى القسم ${sectionNumber}.</p>
      `;
    }
  });
});