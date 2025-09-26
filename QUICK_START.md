# دليل البدء السريع - Fake News Explorer

## 🚀 نشر المشروع على Firebase

### الخطوة 1: إعداد Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### الخطوة 2: إعداد المشروع
```bash
# في مجلد المشروع
firebase use fake-new-explorerr

# إعداد Gemini API Key
firebase functions:config:set gemini.key="YOUR_GEMINI_API_KEY"
```

### الخطوة 3: تثبيت التبعيات
```bash
npm install
cd functions && npm install && cd ..
```

### الخطوة 4: اختبار محلي
```bash
firebase emulators:start
# افتح http://localhost:5000
```

### الخطوة 5: النشر
```bash
firebase deploy
```

## 🔗 الروابط المهمة

- **الموقع المنشور**: https://fake-new-explorerr.firebaseapp.com
- **Firebase Console**: https://console.firebase.google.com/project/fake-new-explorerr
- **Functions Logs**: `firebase functions:log`

## 📱 الصفحات المتاحة

- **الرئيسية**: `/` - تحليل الأخبار
- **الإحصائيات**: `/analytics.html` - إحصائيات التحليلات
- **الأقسام**: `/sections.html` - أقسام الموقع
- **المواقع الموثوقة**: `/trustwebsit.html` - قائمة المواقع الموثوقة
- **من نحن**: `/aboutUs.html` - معلومات عن المشروع

## 🛠️ استكشاف الأخطاء

### إذا لم يعمل التحليل:
1. تحقق من Gemini API Key
2. تأكد من نشر Functions
3. راجع سجلات Firebase Console

### إذا لم تظهر الإحصائيات:
1. تحقق من قواعد Firestore
2. تأكد من وجود بيانات في قاعدة البيانات
3. راجع console في المتصفح

## 📞 المساعدة

- البريد الإلكتروني: ttruescope2025@gmail.com
- GitHub: [رابط المشروع]

---

**ملاحظة**: تأكد من أن لديك مفتاح Gemini API صالح قبل النشر.
