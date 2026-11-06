import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const ready = firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("ضع-") &&
  firebaseConfig.projectId && !firebaseConfig.projectId.includes("ضع-");
const db = ready ? getFirestore(initializeApp(firebaseConfig)) : null;
const defaultLinks = {
  isnaad: "https://zanzache1.github.io/isnaadtarbaoui/",
  taateer: "https://med27771.github.io/zanzache1/",
  tarkia: "https://zanzache1.github.io/tarkia/",
  tarssim: "https://zanzache1.github.io/tarssim/"
};

const year = document.getElementById("copyrightYear");
if (year) year.textContent = String(Math.max(2026, new Date().getFullYear()));

async function loadPublicSettings() {
  if (!db) return;
  try {
    const snap = await getDoc(doc(db, "settings", "site"));
    if (!snap.exists()) return;
    const data = snap.data();
    for (const [key, url] of Object.entries(data.links || {})) {
      const anchor = document.querySelector(`[data-site-link="${key}"]`);
      try {
        const parsed = new URL(url);
        if (anchor && parsed.protocol === "https:") anchor.href = parsed.href;
      } catch { /* تجاهل رابط إعداد غير صالح */ }
    }
    if (data.galleryUrl) {
      const image = document.getElementById("galleryImageDisplay");
      try {
        const parsed = new URL(data.galleryUrl);
        if (image && parsed.protocol === "https:") image.src = parsed.href;
      } catch { /* احتفظ بالصورة الافتراضية */ }
    }
  } catch (error) {
    console.error("تعذر تحميل إعدادات الموقع", error);
  }
}

function setFormStatus(form, text, isError = false) {
  const status = form.querySelector("[data-form-status]");
  if (status) {
    status.textContent = text;
    status.classList.toggle("text-red-300", isError);
    status.classList.toggle("text-green-300", !isError);
  }
}

const newsletter = document.getElementById("newsletterForm");
newsletter?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!db) return setFormStatus(newsletter, "الخدمة غير مهيأة بعد؛ لم يتم حفظ الاشتراك.", true);
  const button = newsletter.querySelector("button[type=submit]");
  button.disabled = true;
  try {
    const email = new FormData(newsletter).get("email").trim().toLowerCase();
    await addDoc(collection(db, "subscribers"), { email, createdAt: serverTimestamp() });
    newsletter.reset();
    setFormStatus(newsletter, "تم تسجيل اشتراكك بنجاح.");
  } catch (error) {
    console.error(error);
    setFormStatus(newsletter, "تعذر تسجيل الاشتراك. حاول لاحقاً.", true);
  } finally { button.disabled = false; }
});

const contact = document.getElementById("contactForm");
contact?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!db) return setFormStatus(contact, "الخدمة غير مهيأة بعد؛ لم يتم إرسال الرسالة.", true);
  const button = contact.querySelector("button[type=submit]");
  button.disabled = true;
  try {
    const form = new FormData(contact);
    await addDoc(collection(db, "messages"), {
      name: form.get("name").trim(),
      email: form.get("email").trim().toLowerCase(),
      type: form.get("type"),
      message: form.get("message").trim(),
      createdAt: serverTimestamp()
    });
    contact.reset();
    setFormStatus(contact, "وصلت رسالتك إلى صاحب الموقع.");
  } catch (error) {
    console.error(error);
    setFormStatus(contact, "تعذر إرسال الرسالة. حاول لاحقاً.", true);
  } finally { button.disabled = false; }
});

loadPublicSettings();