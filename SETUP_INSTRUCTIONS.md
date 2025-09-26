# تعليمات الإعداد - Fake News Explorer

## 🎯 نظرة عامة

هذا المشروع عبارة عن منصة لكشف الأخبار الكاذبة باستخدام:
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Firebase Functions
- **Database**: Firebase Firestore
- **AI**: Google Gemini API
- **Hosting**: Firebase Hosting

## 📋 المتطلبات

- Node.js 22+
- Firebase CLI
- حساب Google (لـ Firebase)
- Gemini API Key

## 🚀 خطوات الإعداد

### 1. إعداد البيئة المحلية

```bash
# تثبيت Firebase CLI
npm install -g firebase-tools

# تسجيل الدخول
firebase login

# التحقق من المشروع
firebase projects:list
```

### 2. إعداد المشروع

```bash
# الانتقال لمجلد المشروع
cd fake_news

# ربط المشروع بـ Firebase
firebase use fake-new-explorerr

# إعداد Gemini API Key
firebase functions:config:set gemini.key="AIzaSyA2eov2yTsbAaA8LNaN8hvtmmFAcLgcARo"
```

### 3. تثبيت التبعيات

```bash
# تثبيت تبعيات المشروع الرئيسي
npm install

# تثبيت تبعيات Functions
cd functions
npm install
cd ..
```

### 4. اختبار محلي

```bash
# تشغيل المحاكي المحلي
firebase emulators:start

# أو
npm run serve
```

الموقع سيكون متاحاً على: `http://localhost:5000`

### 5. النشر

```bash
# نشر كامل
firebase deploy

# أو نشر أجزاء محددة
firebase deploy --only functions
firebase deploy --only hosting
firebase deploy --only firestore
```

## 🔧 إعدادات مهمة

### Firebase Configuration
المشروع مُعد مسبقاً بالإعدادات التالية:
- **Project ID**: `fake-new-explorerr`
- **Region**: `eur3` (أوروبا)
- **Runtime**: `nodejs22`

### Gemini API
- **Model**: `gemini-1.5-pro`
- **Key**: مُعد في Firebase Functions Config

### Firestore Rules
- القراءة متاحة للجميع
- الكتابة محمية (Functions فقط)

## 📱 الصفحات المتاحة

1. **الرئيسية** (`/`): تحليل الأخبار
2. **الإحصائيات** (`/analytics.html`): إحصائيات التحليلات
3. **الأقسام** (`/sections.html`): أقسام الموقع
4. **المواقع الموثوقة** (`/trustwebsit.html`): قائمة المواقع الموثوقة
5. **من نحن** (`/aboutUs.html`): معلومات عن المشروع

## 🛠️ استكشاف الأخطاء

### مشاكل شائعة:

#### 1. خطأ في Gemini API
```bash
# التحقق من المفتاح
firebase functions:config:get

# إعادة تعيين
firebase functions:config:set gemini.key="NEW_KEY"
firebase deploy --only functions
```

#### 2. خطأ في Firestore
```bash
# اختبار القواعد
firebase emulators:start --only firestore

# إعادة نشر القواعد
firebase deploy --only firestore:rules
```

#### 3. خطأ في Hosting
```bash
# مسح الكاش
firebase hosting:channel:delete preview

# إعادة النشر
firebase deploy --only hosting
```

## 📊 مراقبة الأداء

### Firebase Console
1. انتقل إلى: https://console.firebase.google.com/project/fake-new-explorerr
2. راقب:
   - **Functions**: الاستدعاءات والأخطاء
   - **Firestore**: استخدام قاعدة البيانات
   - **Hosting**: حركة المرور

### سجلات التشخيص
```bash
# سجلات Functions
firebase functions:log

# سجلات Hosting
firebase hosting:channel:list

# فهارس Firestore
firebase firestore:indexes
```

## 🔄 التحديثات

### تحديث الكود
```bash
git pull origin main
npm install
cd functions && npm install && cd ..
firebase deploy
```

### تحديث التبعيات
```bash
npm update
cd functions && npm update && cd ..
firebase deploy --only functions
```

## 📞 الدعم

- **البريد الإلكتروني**: ttruescope2025@gmail.com
- **Firebase Console**: https://console.firebase.google.com/project/fake-new-explorerr
- **الموقع المنشور**: https://fake-new-explorerr.firebaseapp.com

## 📝 ملاحظات مهمة

1. **Gemini API Key**: تأكد من صحة المفتاح
2. **Firestore Rules**: مراجعة قواعد الأمان
3. **Functions Limits**: مراقبة حدود الاستخدام
4. **Backup**: احتفظ بنسخة احتياطية من البيانات

---

**ملاحظة**: تأكد من اختبار جميع الوظائف محلياً قبل النشر على الإنتاج.
