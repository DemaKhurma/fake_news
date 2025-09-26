# إعداد Firebase للمشروع

## 🔧 الخطوات المطلوبة

### 1. إعداد Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 2. ربط المشروع بـ Firebase
```bash
firebase use fake-new-explorerr
```

### 3. إعداد Gemini API Key
```bash
firebase functions:config:set gemini.key="AIzaSyA2eov2yTsbAaA8LNaN8hvtmmFAcLgcARo"
```

### 4. تثبيت التبعيات
```bash
npm install
cd functions && npm install && cd ..
```

### 5. اختبار محلي
```bash
firebase emulators:start
```

### 6. النشر
```bash
firebase deploy
```

## 📊 إعدادات المشروع الحالية

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

## 🚀 روابط مهمة

- **Firebase Console**: https://console.firebase.google.com/project/fake-new-explorerr
- **الموقع المنشور**: https://fake-new-explorerr.firebaseapp.com
- **Functions Logs**: `firebase functions:log`

## 📝 ملاحظات مهمة

1. تأكد من أن Gemini API Key صالح
2. تحقق من إعدادات Firestore Rules
3. راقب استخدام Firebase Functions
4. احتفظ بنسخة احتياطية من البيانات المهمة

## 🔍 استكشاف الأخطاء

### خطأ في Functions
```bash
firebase functions:log --only analyzeNews
```

### خطأ في Firestore
```bash
firebase firestore:indexes
```

### خطأ في Hosting
```bash
firebase hosting:channel:list
```

---

**ملاحظة**: تأكد من اختبار جميع الوظائف محلياً قبل النشر.
