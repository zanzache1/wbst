// إعدادات Firebase الخاصة بتطبيق الويب. هذه القيم عامة بطبيعتها؛ الأمان تفرضه قواعد Firestore وStorage.
export const firebaseConfig = {
  apiKey: "ضع-apiKey-هنا",
  authDomain: "ضع-project-id.firebaseapp.com",
  projectId: "ضع-project-id-هنا",
  storageBucket: "ضع-storage-bucket-هنا",
  messagingSenderId: "ضع-sender-id-هنا",
  appId: "ضع-app-id-هنا"
};

// اكتب هنا البريد نفسه الذي ستضعه في firestore.rules وstorage.rules.
export const ADMIN_EMAIL = "ضع-بريد-المدير-هنا";

// اجعله true بعد تثبيت إضافة Trigger Email وإعداد خادم SMTP في Firebase.
export const EMAIL_EXTENSION_ENABLED = false;