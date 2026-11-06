# إعداد الموقع ولوحة المدير

## ما الذي تغيّر؟
- الصفحة الرئيسية الآن هي `index.html` (GitHub Pages لا يستخدم `index.txt` كصفحة البداية).
- الاشتراكات ورسائل الزوار تُحفظ في Cloud Firestore.
- صفحة `admin-panel/admin.html` تطلب دخول Firebase Auth، وتعرض لوحة التحكم بعد مطابقة بريد المدير.
- حفظ الروابط يحدّث `settings/site` وتقرأ الصفحة العامة الإعدادات المنشورة.
- رفع صورة المعرض يرفعها إلى Firebase Storage ويحدّث رابطها.
- رسائل الزوار والمشتركون لا يقرأها إلا المدير حسب قواعد Firestore.
- لا يوجد رابط لوحة الإدارة في الصفحة العامة.

## الإعداد المطلوب مرة واحدة

1. أنشئ مشروعاً في Firebase Console وسجّل تطبيق Web. من إعدادات التطبيق انسخ كائن إعداد Firebase.
2. فعّل **Authentication > Sign-in method > Email/Password**، وأنشئ مستخدم المدير بنفسك من **Authentication > Users > Add user**. لا يوجد تسجيل ذاتي من صفحة الموقع.
3. أنشئ قاعدة **Cloud Firestore** بوضع الإنتاج.
4. عدّل `firebase-config.js`: الصق قيم إعداد Firebase، وضع بريد المدير في `ADMIN_EMAIL`.
5. في `firestore.rules` و`storage.rules` بدّل `ADMIN_EMAIL_HERE` ببريد المدير نفسه (بحروف صغيرة).
6. انشر قواعد Firestore من تبويب Rules في Firebase Console، وانشر `storage.rules` في تبويب Storage > Rules. يمكن أيضاً نشر القواعد من Firebase CLI بعد ربط المشروع: `firebase deploy --only firestore:rules,storage`.
7. أضف النطاق `zanzache1.github.io` إلى **Authentication > Settings > Authorized domains**.
8. ارفع محتويات هذا المجلد إلى جذر مستودع `wbst`، مع الملف `index.html` والمجلدين والملفات الجديدة، ثم انتظر نشر GitHub Pages.

## تفعيل رفع الصور

أنشئ Storage bucket وانشر `storage.rules`. اعتباراً من 3 فبراير 2026، تتطلب خدمة Cloud Storage for Firebase خطة Blaze مرتبطة بحساب فوترة؛ قد توجد حصص مجانية، لكن تجاوزها قد يسبب تكلفة. إذا لم تفعّل Storage فلن يعمل رفع الصورة، بينما تبقى الروابط ورسائل الزوار على Firestore.

## تفعيل إرسال البريد من لوحة المدير

الإرسال يحتاج خدمة بريد SMTP وإضافة Firebase الرسمية **Trigger Email**. ثبّت الإضافة واجعل مجموعة المستندات التي تراقبها `mail`، ثم أضف بيانات SMTP السرية داخل إعداد الإضافة في Firebase، لا في ملفات الموقع. بعد نجاح إعداد الإضافة، غيّر `EMAIL_EXTENSION_ENABLED` إلى `true` في `firebase-config.js` وانشر الموقع. عندها تُرسل الرسائل إلى مشترك محدد أو إلى أول 100 مشترك. بدون الإضافة، لن يظهر الإرسال كأنه تم.

## ملاحظات
- إعداد Firebase في المتصفح ليس كلمة مرور سرية؛ قواعد Firestore وStorage هي التي تمنع الوصول غير المصرح.
- لا تضع كلمة مرور المدير أو مفاتيح SMTP أو مفاتيح خدمة Firebase Admin في هذا المستودع.
- Firebase لا يوفّر حدّاً تلقائياً لعدد رسائل الزوار بهذه القواعد. إذا تعرض النموذج للرسائل المزعجة، أضف App Check أو خدمة تحقق ومكافحة رسائل مزعجة.
- احفظ نسخة من بياناتك عند الحاجة؛ Firestore يخزن الرسائل والاشتراكات سحابياً.