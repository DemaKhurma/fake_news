# Fake News Explorer 🔍

منصة ذكية لكشف الأخبار الكاذبة باستخدام الذكاء الاصطناعي و Gemini API

## 🌟 المميزات

- **تحليل ذكي للأخبار**: استخدام Gemini AI لتحليل الأخبار وتحديد صحتها
- **نسبة الثقة**: عرض نسبة الثقة في كل تحليل
- **المصادر البديلة**: اقتراح مصادر موثوقة للأخبار الصحيحة
- **فحص الحقائق**: توفير معلومات إضافية للتحقق من الحقائق
- **إحصائيات شاملة**: عرض إحصائيات مفصلة عن التحليلات
- **واجهة عربية**: تصميم متجاوب باللغة العربية
- **تخزين آمن**: حفظ جميع التحليلات في Firebase Firestore

## 🛠️ التقنيات المستخدمة

### Frontend
- **HTML5 & CSS3**: تصميم الواجهة
- **JavaScript ES6+**: التفاعل والوظائف
- **Firebase SDK**: التكامل مع خدمات Firebase

### Backend
- **Firebase Functions**: الخادم الخلفي
- **Firebase Firestore**: قاعدة البيانات
- **Firebase Hosting**: الاستضافة
- **Gemini API**: تحليل الأخبار بالذكاء الاصطناعي

## 📁 بنية المشروع

```
fake_news/
├── public/                 # ملفات الواجهة الأمامية
│   ├── index.html         # الصفحة الرئيسية
│   ├── analytics.html     # صفحة الإحصائيات
│   ├── sections.html      # الأقسام
│   ├── trustwebsit.html   # المواقع الموثوقة
│   ├── aboutUs.html       # من نحن
│   ├── app.js            # منطق التطبيق
│   ├── firebase-init.js  # إعدادات Firebase
│   └── images/           # الصور
├── functions/            # Firebase Functions
│   ├── index.js         # الدوال الرئيسية
│   └── package.json     # تبعيات Functions
├── firebase.json        # إعدادات Firebase
├── firestore.rules      # قواعد Firestore
├── firestore.indexes.json # فهارس Firestore
└── package.json         # تبعيات المشروع
```

## 🚀 التثبيت والتشغيل

### المتطلبات
- Node.js 22+
- Firebase CLI
- حساب Firebase
- Gemini API Key

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd fake_news
```

2. **تثبيت Firebase CLI**
```bash
npm install -g firebase-tools
```

3. **تسجيل الدخول إلى Firebase**
```bash
firebase login
```

4. **تثبيت التبعيات**
```bash
npm install
cd functions && npm install && cd ..
```

5. **إعداد Firebase**
```bash
firebase init
```

6. **إعداد Gemini API Key**
```bash
firebase functions:config:set gemini.key="YOUR_GEMINI_API_KEY"
```

### التشغيل المحلي

```bash
# تشغيل المحاكي المحلي
npm run serve

# أو
firebase emulators:start
```

الموقع سيكون متاحاً على: `http://localhost:5000`

## 📦 النشر

### نشر كامل
```bash
npm run deploy
```

### نشر أجزاء محددة
```bash
# نشر الاستضافة فقط
npm run deploy:hosting

# نشر Functions فقط
npm run deploy:functions

# نشر Firestore فقط
npm run deploy:firestore
```

## 🔧 الإعدادات

### Firebase Configuration
تحديث إعدادات Firebase في الملفات التالية:
- `public/firebase-init.js`
- `public/index.html`
- `public/analytics.html`

### Gemini API
تحديث مفتاح Gemini API في:
- `functions/index.js`
- أو استخدام Firebase Functions Config

## 📊 API Endpoints

### Firebase Functions

#### `analyzeNews`
تحليل خبر باستخدام Gemini AI

**المدخلات:**
```javascript
{
  text: "نص الخبر",
  link: "رابط الخبر (اختياري)",
  lang: "ar" // أو "en"
}
```

**المخرجات:**
```javascript
{
  classification: "true" | "fake",
  trust_score: 85,
  classification_reason: "سبب التصنيف",
  alternative_sources: [
    { title: "عنوان", url: "رابط" }
  ],
  fact_check: [
    { claim: "ادعاء", publisher: "ناشر", url: "رابط" }
  ]
}
```

#### `getAnalytics`
جلب إحصائيات التحليلات

**المخرجات:**
```javascript
{
  totalAnalyses: 150,
  fakeCount: 45,
  trueCount: 105,
  averageTrustScore: 78,
  recentAnalyses: [...]
}
```

## 🗄️ قاعدة البيانات

### Firestore Collections

#### `news_analyses`
```javascript
{
  text: "نص الخبر",
  link: "رابط الخبر",
  classification: "true" | "fake",
  trust_score: 85,
  classification_reason: "سبب التصنيف",
  alternative_sources: [...],
  fact_check: [...],
  timestamp: Timestamp,
  user_id: "معرف المستخدم",
  ip_address: "عنوان IP"
}
```

## 🔒 الأمان

- قواعد Firestore محمية
- التحقق من صحة البيانات
- حماية من CORS
- تسجيل العمليات

## 🌐 الاستضافة

الموقع منشور على Firebase Hosting مع:
- CDN عالمي
- HTTPS تلقائي
- إعادة التوجيه
- ضغط الملفات

## 📈 المراقبة

- Firebase Analytics
- Firebase Performance
- Cloud Functions Logs
- Firestore Usage

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📝 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 التواصل

- البريد الإلكتروني: ttruescope2025@gmail.com
- الموقع: [Fake News Explorer](https://fake-new-explorerr.firebaseapp.com)

## 🙏 شكر وتقدير

- Google Gemini AI
- Firebase Team
- المجتمع المفتوح المصدر

---

**ملاحظة**: هذا المشروع مخصص للأغراض التعليمية والبحثية. يرجى استخدامه بمسؤولية.