# دليل النشر - Fake News Explorer

## 🚀 خطوات النشر على Firebase

### 1. التحضير للنشر

```bash
# التأكد من تسجيل الدخول
firebase login

# التحقق من المشروع الحالي
firebase projects:list

# تحديد المشروع
firebase use fake-new-explorerr
```

### 2. إعداد Gemini API Key

```bash
# إضافة مفتاح Gemini API
firebase functions:config:set gemini.key="YOUR_GEMINI_API_KEY"

# التحقق من الإعدادات
firebase functions:config:get
```

### 3. اختبار المحاكي المحلي

```bash
# تشغيل المحاكي
firebase emulators:start

# اختبار الوظائف
curl -X POST http://localhost:5001/fake-new-explorerr/us-central1/analyzeNews \
  -H "Content-Type: application/json" \
  -d '{"data":{"text":"خبر تجريبي للاختبار","lang":"ar"}}'
```

### 4. النشر

#### النشر الكامل
```bash
firebase deploy
```

#### النشر التدريجي
```bash
# نشر Functions أولاً
firebase deploy --only functions

# نشر Firestore Rules
firebase deploy --only firestore

# نشر Hosting
firebase deploy --only hosting
```

### 5. التحقق من النشر

```bash
# عرض معلومات النشر
firebase hosting:sites:list

# عرض سجلات Functions
firebase functions:log

# اختبار الموقع المنشور
curl https://fake-new-explorerr.firebaseapp.com
```

## 🔧 إعدادات البيئة

### متغيرات البيئة المطلوبة

```bash
# في Firebase Functions
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-pro

# في Firebase Config
firebase functions:config:set \
  gemini.key="your_gemini_api_key" \
  gemini.model="gemini-1.5-pro"
```

### إعدادات Firestore

```bash
# نشر قواعد Firestore
firebase deploy --only firestore:rules

# نشر فهارس Firestore
firebase deploy --only firestore:indexes
```

## 📊 مراقبة الأداء

### Firebase Console
1. انتقل إلى [Firebase Console](https://console.firebase.google.com)
2. اختر مشروع `fake-new-explorerr`
3. راقب:
   - **Functions**: عدد الاستدعاءات والأخطاء
   - **Firestore**: استخدام قاعدة البيانات
   - **Hosting**: حركة المرور والأداء

### سجلات التشخيص

```bash
# عرض سجلات Functions
firebase functions:log --only analyzeNews

# عرض سجلات Hosting
firebase hosting:channel:list

# مراقبة Firestore
firebase firestore:indexes
```

## 🛠️ استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. خطأ في Gemini API
```bash
# التحقق من المفتاح
firebase functions:config:get gemini

# إعادة تعيين المفتاح
firebase functions:config:set gemini.key="NEW_KEY"
firebase deploy --only functions
```

#### 2. خطأ في Firestore Rules
```bash
# اختبار القواعد محلياً
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

## 📈 تحسين الأداء

### تحسين Functions
- استخدام `memory` و `timeout` مناسبة
- تحسين استدعاءات Gemini API
- إضافة caching للنتائج المتكررة

### تحسين Hosting
- ضغط الملفات
- تحسين الصور
- استخدام CDN

### تحسين Firestore
- إضافة فهارس مناسبة
- تحسين الاستعلامات
- استخدام pagination

## 🔒 الأمان

### حماية API Keys
```bash
# لا تضع المفاتيح في الكود
# استخدم Firebase Functions Config
firebase functions:config:set gemini.key="SECRET_KEY"
```

### قواعد Firestore
- مراجعة قواعد الأمان بانتظام
- اختبار القواعد محلياً
- استخدام least privilege principle

## 📞 الدعم

### موارد مفيدة
- [Firebase Documentation](https://firebase.google.com/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Firebase Community](https://firebase.community)

### التواصل
- البريد الإلكتروني: ttruescope2025@gmail.com
- GitHub Issues: [مشاكل المشروع](https://github.com/your-repo/issues)

---

**ملاحظة**: تأكد من اختبار جميع التغييرات محلياً قبل النشر على الإنتاج.
