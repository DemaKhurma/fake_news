# إعداد Firebase - Fake News Explorer

## 🎯 نظرة عامة

هذا الملف يوضح كيفية إعداد Firebase للمشروع مع جميع الخدمات المطلوبة.

## 📋 المتطلبات

- ✅ حساب Google
- ✅ Firebase CLI
- ✅ Node.js 22+
- ✅ Gemini API Key

## 🔧 خطوات الإعداد

### 1. تثبيت Firebase CLI

```bash
# تثبيت Firebase CLI
npm install -g firebase-tools

# التحقق من التثبيت
firebase --version
```

### 2. تسجيل الدخول

```bash
# تسجيل الدخول إلى Firebase
firebase login

# التحقق من الحساب
firebase projects:list
```

### 3. ربط المشروع

```bash
# الانتقال لمجلد المشروع
cd fake_news

# ربط المشروع بـ Firebase
firebase use fake-new-explorerr

# التحقق من الإعدادات
firebase projects:list
```

### 4. إعداد Gemini API

```bash
# إضافة مفتاح Gemini API
firebase functions:config:set gemini.key="AIzaSyA2eov2yTsbAaA8LNaN8hvtmmFAcLgcARo"

# التحقق من الإعدادات
firebase functions:config:get
```

### 5. تثبيت التبعيات

```bash
# تثبيت تبعيات المشروع الرئيسي
npm install

# تثبيت تبعيات Functions
cd functions
npm install
cd ..
```

## 🚀 اختبار محلي

```bash
# تشغيل المحاكي المحلي
firebase emulators:start

# أو
npm run serve
```

الموقع سيكون متاحاً على: `http://localhost:5000`

## 📊 إعدادات المشروع

### Firebase Project ID
`fake-new-explorerr`

### Firebase Configuration
```javascript
{
  apiKey: "AIzaSyCBHUJ5VMwhQMIpNQnVgweAh10rj-bzn0A",
  authDomain: "fake-new-explorerr.firebaseapp.com",
  projectId: "fake-new-explorerr",
  storageBucket: "fake-new-explorerr.firebasestorage.app",
  messagingSenderId: "803307691171",
  appId: "1:803307691171:web:141b6d2dcb40878f603316",
  measurementId: "G-DVWJVTY8XM"
}
```

### Gemini API Key
`AIzaSyA2eov2yTsbAaA8LNaN8hvtmmFAcLgcARo`

### Firestore Region
`eur3` (أوروبا)

### Functions Runtime
`nodejs22`

## 🔗 الروابط المهمة

- **Firebase Console**: https://console.firebase.google.com/project/fake-new-explorerr
- **الموقع المنشور**: https://fake-new-explorerr.firebaseapp.com
- **Functions Logs**: `firebase functions:log`

## 🛠️ استكشاف الأخطاء

### مشاكل شائعة:

#### 1. خطأ في Firebase CLI
```bash
# إعادة تثبيت
npm uninstall -g firebase-tools
npm install -g firebase-tools
```

#### 2. خطأ في تسجيل الدخول
```bash
# إعادة تسجيل الدخول
firebase logout
firebase login
```

#### 3. خطأ في ربط المشروع
```bash
# التحقق من المشاريع
firebase projects:list

# إعادة الربط
firebase use fake-new-explorerr
```

#### 4. خطأ في Gemini API
```bash
# التحقق من المفتاح
firebase functions:config:get

# إعادة تعيين
firebase functions:config:set gemini.key="NEW_KEY"
```

## 📝 ملاحظات مهمة

1. **Gemini API Key**: تأكد من صحة المفتاح
2. **Firebase Project**: تأكد من ربط المشروع الصحيح
3. **Dependencies**: تأكد من تثبيت جميع التبعيات
4. **Testing**: اختبر محلياً قبل النشر

## 🔄 التحديثات

### تحديث Firebase CLI
```bash
npm update -g firebase-tools
```

### تحديث التبعيات
```bash
npm update
cd functions && npm update && cd ..
```

## 📞 الدعم

- **Firebase Console**: https://console.firebase.google.com/project/fake-new-explorerr
- **Firebase Documentation**: https://firebase.google.com/docs
- **Firebase Community**: https://firebase.community

---

**ملاحظة**: تأكد من اختبار جميع الإعدادات محلياً قبل النشر.
