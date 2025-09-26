# دليل النشر - Fake News Explorer

## 🎯 نظرة عامة

هذا الدليل يوضح كيفية نشر مشروع Fake News Explorer على Firebase Hosting مع جميع الخدمات المطلوبة.

## 📋 المتطلبات المسبقة

- ✅ حساب Google
- ✅ Firebase CLI مثبت
- ✅ Node.js 22+
- ✅ Gemini API Key

## 🚀 خطوات النشر

### 1. إعداد البيئة

```bash

npm install -g firebase-tools


firebase login


firebase projects:list
```

### 2. إعداد المشروع

```bash

cd fake_news


firebase use fake-new-explorerr


firebase projects:list
```

### 3. إعداد Gemini API

```bash

firebase functions:config:set gemini.key="AIzaSyA2eov2yTsbAaA8LNaN8hvtmmFAcLgcARo"


firebase functions:config:get
```

### 4. تثبيت التبعيات

```bash

npm install


cd functions
npm install
cd ..
```

### 5. اختبار محلي

```bash

firebase emulators:start

# اختبار الموقع
# افتح http://localhost:5000
```

### 6. النشر

#### النشر الكامل
```bash
firebase deploy
```

#### النشر التدريجي
```bash

firebase deploy --only functions


firebase deploy --only firestore


firebase deploy --only hosting
```

## 🔗 الروابط المهمة

### بعد النشر
- **الموقع المنشور**: https://fake-new-explorerr.firebaseapp.com
- **Firebase Console**: https://console.firebase.google.com/project/fake-new-explorerr
- **Functions Logs**: `firebase functions:log`

### الصفحات المتاحة
- **الرئيسية**: `/` - تحليل الأخبار
- **الإحصائيات**: `/analytics.html` - إحصائيات التحليلات
- **الأقسام**: `/sections.html` - أقسام الموقع
- **المواقع الموثوقة**: `/trustwebsit.html` - قائمة المواقع الموثوقة
- **من نحن**: `/aboutUs.html` - معلومات عن المشروع

## 🛠️ استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. خطأ في Gemini API
```bash

firebase functions:config:get gemini


firebase functions:config:set gemini.key="NEW_KEY"
firebase deploy --only functions
```

#### 2. خطأ في Firestore Rules
```bash

firebase emulators:start --only firestore

firebase deploy --only firestore:rules
```

#### 3. خطأ في Hosting
```bash

firebase hosting:channel:delete preview


firebase deploy --only hosting
```

#### 4. خطأ في Functions
```bash

firebase functions:log


firebase deploy --only functions
```

## 📊 مراقبة الأداء

### Firebase Console
1. انتقل إلى: https://console.firebase.google.com/project/fake-new-explorerr
2. راقب:
   - **Functions**: عدد الاستدعاءات والأخطاء
   - **Firestore**: استخدام قاعدة البيانات
   - **Hosting**: حركة المرور والأداء

### سجلات التشخيص
```bash
# سجلات Functions
firebase functions:log --only analyzeNews

# سجلات Hosting
firebase hosting:channel:list

# فهارس Firestore
firebase firestore:indexes
```

## 🔄 التحديثات

### تحديث الكود
```bash
# جلب آخر التحديثات
git pull origin main

# تثبيت التبعيات الجديدة
npm install
cd functions && npm install && cd ..

# نشر التحديثات
firebase deploy
```

### تحديث التبعيات
```bash
# تحديث تبعيات المشروع
npm update

# تحديث تبعيات Functions
cd functions && npm update && cd ..

# نشر التحديثات
firebase deploy --only functions
```

## 🔒 الأمان

### حماية API Keys
- ✅ لا تضع المفاتيح في الكود
- ✅ استخدم Firebase Functions Config
- ✅ راجع قواعد Firestore بانتظام

### قواعد Firestore
```javascript
// القراءة متاحة للجميع
allow read: if true;

// الكتابة محمية (Functions فقط)
allow write: if false;
```

## 📈 تحسين الأداء

### Functions
- استخدام `memory` و `timeout` مناسبة
- تحسين استدعاءات Gemini API
- إضافة caching للنتائج المتكررة

### Hosting
- ضغط الملفات تلقائياً
- استخدام CDN
- تحسين الصور

### Firestore
- إضافة فهارس مناسبة
- تحسين الاستعلامات
- استخدام pagination

## 📞 الدعم

### موارد مفيدة
- [Firebase Documentation](https://firebase.google.com/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Firebase Community](https://firebase.community)

### التواصل
- **البريد الإلكتروني**: ttruescope2025@gmail.com
- **GitHub**: [رابط المشروع]
- **Firebase Console**: https://console.firebase.google.com/project/fake-new-explorerr

## 📝 ملاحظات مهمة

1. **Gemini API Key**: تأكد من صحة المفتاح قبل النشر
2. **Firestore Rules**: مراجعة قواعد الأمان بانتظام
3. **Functions Limits**: مراقبة حدود الاستخدام
4. **Backup**: احتفظ بنسخة احتياطية من البيانات المهمة
5. **Testing**: اختبر جميع الوظائف محلياً قبل النشر

---

**ملاحظة**: تأكد من اختبار جميع التغييرات محلياً قبل النشر على الإنتاج.
