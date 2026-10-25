# Izac Fayz – Portfolio + Dashboard (Next.js JS · Tailwind · Firebase · Cloudinary)

## تشغيل محلي
```bash
npm install
cp .env.example .env.local   # املأ القيم (الخطوات تحت)
npm run dev                  # الموقع: http://localhost:3000  — الداشبورد: /admin
```
من غير env الموقع بيشتغل بالمحتوى الافتراضي، لكن /admin وحفظ التعديلات محتاجين Firebase + Cloudinary.

## الإعداد (مرة واحدة)
1. **Firebase** → Create project
   - Build ▸ Authentication ▸ Sign-in method ▸ **Email/Password** (Enable) ▸ Users ▸ **Add user** (إيميل وباسورد العميل).
   - Build ▸ Firestore Database ▸ Create (Production mode) ▸ Rules: الصق محتوى `firestore.rules` (بيقفل الداتا عن المتصفح؛ السيرفر بس هو اللي بيكتب).
   - Project settings ▸ General ▸ Your apps ▸ Web app → انسخ القيم في `NEXT_PUBLIC_FIREBASE_*`.
   - Project settings ▸ Service accounts ▸ Generate new private key → `FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY`.
   - `ADMIN_EMAILS` = إيميل العميل (ممكن أكتر من واحد بفاصلة). أي حد غيره مش هيقدر يدخل حتى لو عنده حساب.
2. **Cloudinary** → Dashboard: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` و `CLOUDINARY_API_KEY` و `CLOUDINARY_API_SECRET`.
3. **Vercel** → Import repo من GitHub ▸ Settings ▸ Environment Variables: ضيف كل متغيرات `.env.example` + `NEXT_PUBLIC_SITE_URL` (الدومين الحقيقي) ▸ Redeploy.

## ملفاتك أنت (من غير ما تستهلك Cloudinary)
| الملف | يتحط فين |
|---|---|
| صورة الـ hero | `public/images/hero-izac.jpg` |
| صورة About | `public/images/about-izac.jpg` |
| فيديوهات الشغل | `public/works/…` وبعدين في الداشبورد ▸ Work ▸ Add project ▸ اكتب المسار `/works/اسم.mp4` (أو في `src/content/defaults.js`) |
| لوجوهات البراندات | `public/brands/…` ▸ الداشبورد ▸ Brands ▸ Logo ▸ اكتب `/brands/اسم.png` |
| الـ CV | `public/izac-fayz-cv.pdf` |
| Favicon | ضع `icon.png` في `src/app/` (بيستبدل الأيقونة المولدة) |

أي ملف بيرفعه العميل من الداشبورد بيروح Cloudinary (مجلد `izac/`)، ولما يستبدله أو يحذفه الملف القديم بيتمسح من Cloudinary بعد الحفظ.
الملفات اللي أنت رافعها على GitHub بيقدر العميل يستبدلها أو يشيلها من الموقع (بيتشال الربط)، والملف نفسه بيفضل في الريبو.

> بعد أول حفظ من الداشبورد، المحتوى المخزن في Firestore هو اللي بيظهر. تغيير `defaults.js` بعد كده ما بيأثرش إلا لو دوست **Reset to defaults**.

## بيانات مؤقتة لازم تتراجع
- أسماء البراندات (Telecom Egypt / Familia / Papia) نصوص مؤقتة لحد ما يترفع اللوجو.
- قسم Testimonials فاضي ومخفي تلقائيًا لحد ما تترفع سكرينات الشاتات.
- الإيميل ورقم الواتساب واللينكات من الـ CV (الرقم في التصميم كان 906 والـ CV فيه 806: اتاخد من الـ CV).
- خانات Work عبارة عن placeholders لحد ما تتحط الفيديوهات.

## الأمان
CSP + HSTS + X-Frame-Options + nosniff + Permissions-Policy (في `next.config.mjs`) · Firestore مقفول بالكامل للمتصفح · كل API الداشبورد بتتحقق من Firebase ID token + قائمة `ADMIN_EMAILS` + same-origin + rate limit · المحتوى بيتنضف قبل التخزين (بيمنع `javascript:`/`data:` وروابط الميديا لازم تكون من الموقع أو Cloudinary) · توقيع رفع Cloudinary من السيرفر وحذف مقيد بمجلد `izac/` فقط · `/admin` و`/api` noindex ومحجوبين في robots.

## SEO / GEO / Performance
Metadata + canonical + OG/Twitter + OG image مولدة · JSON-LD (WebSite, Person, ProfessionalService بدون Review) · `sitemap.xml` · `robots.txt` (بيسمح لـ AI crawlers) · `/llms.txt` · geo meta (Tanta, EG) · صفحة static مع revalidate فوري عند الحفظ · الخط الافتراضي system (صفر تحميل) · الفيديو بيتحمّل عند الضغط play فقط · صور Cloudinary بـ `f_auto,q_auto` و srcset · أنيميشن CSS بس.
