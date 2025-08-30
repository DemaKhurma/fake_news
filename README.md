# 🛡️ Misinfo Guardian

مشروع يهدف إلى مكافحة الأخبار المضللة (Fake News) باستخدام تقنيات:
- واجهة أمامية (Frontend) لعرض النتائج.
- خلفية (Backend) مبنية بـ FastAPI لمعالجة البيانات.
- إضافة متصفح (Chrome Extension) لاكتشاف المحتوى المشبوه مباشرة من الصفحات.

---

## 📂 هيكل المشروع
misinfo-guardian/
│
├─ frontend/               ← واجهة المستخدم (HTML/CSS/JS)
│   ├─ index.html
│   ├─ styles.css
│   └─ app.js
│
├─ backend/                ← FastAPI (بايثون)
│   ├─ main.py
│   ├─ requirements.txt
│   └─ .env
│
├─ extension/              ← إضافة كروم
│   ├─ manifest.json
│   ├─ content.js
│   ├─ popup.html
│   └─ popup.js
│
└─ README.md





---

## ⚙️ المتطلبات

- Python 3.10+
- FastAPI
- Uvicorn
- متصفح Google Chrome لتجربة الإضافة

---

## 🚀 كيفية التشغيل

### 1. Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload