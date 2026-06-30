# MovieVault 🎬

منصة شخصية شاملة لمشاهدة الأفلام والمسلسلات والمسرحيات بتصميم حديث وواجهة احترافية.

## المميزات ✨

### نظام الحسابات
- ✅ التسجيل والدخول الآمن
- ✅ 4 ملفات شخصية لكل حساب
- ✅ كل ملف شخصي له بيانات منفصلة

### مكتبة الأفلام
- ✅ عرض شامل لجميع الأفلام والمسلسلات والمسرحيات
- ✅ تصنيف حسب النوع والسنة
- ✅ بحث متقدم

### ميزات المشاهدة
- ✅ مشغل فيديو مخصص
- ✅ دعم الترجمات المتعددة
- ✅ حفظ موضع المشاهدة تلقائياً
- ✅ قائمة "تابع المشاهدة"

### الإعدادات الشخصية
- ✅ المفضلة
- ✅ قائمة المشاهدة
- ✅ التقييمات والمراجعات

### لوحة التحكم
- ✅ إضافة أعمال جديدة
- ✅ تحميل من رابط أو ملف
- ✅ ملفات منفصلة للفيديو والترجمة والصور

### التصميم
- 🎨 Glassmorphism Design
- 🌙 Dark Theme
- 📱 Responsive (موبايل، تابلت، ديسكتوب)
- ✨ واجهة سلسة وراقية

## المتطلبات

### Backend
- Node.js 16+
- MongoDB Atlas
- npm أو yarn

### Frontend
- Node.js 16+
- npm أو yarn

## التثبيت والتشغيل

### Backend Setup

```bash
# الدخول للمجلد
cd backend

# تثبيت المكتبات
npm install

# إنشاء ملف .env
cp .env.example .env

# إضافة بيانات قاعدة البيانات الخاصة بك في .env
# ثم تشغيل الخادم
npm run dev
```

### Frontend Setup

```bash
# الدخول للمجلد
cd frontend

# تثبيت المكتبات
npm install

# إنشاء ملف .env.local (اختياري)
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# تشغيل التطبيق
npm run dev
```

## البنية المشروع

```
MovieVault/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── app.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── api/
│   │   ├── App.tsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
│
└── README.md
```

## التقنيات المستخدمة

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **TypeScript** - Type safety
- **Cloudinary** - File storage

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation

## APIs

### Authentication
- `POST /api/auth/register` - إنشاء حساب
- `POST /api/auth/login` - تسجيل دخول

### Profiles
- `GET /api/profiles` - الحصول على الملفات الشخصية
- `PUT /api/profiles/:id` - تحديث الملف الشخصي
- `POST /api/profiles/switch/:id` - تبديل الملف الشخصي

### Works
- `GET /api/works` - الحصول على جميع الأعمال
- `GET /api/works/:id` - الحصول على عمل معين
- `POST /api/works` - إضافة عمل جديد
- `PUT /api/works/:id` - تحديث عمل
- `DELETE /api/works/:id` - حذف عمل

### Favorites
- `GET /api/favorites` - المفضلة
- `POST /api/favorites` - إضافة للمفضلة
- `DELETE /api/favorites/:workId` - حذف من المفضلة

### Watchlist
- `GET /api/watchlist` - قائمة المشاهدة
- `POST /api/watchlist` - إضافة لقائمة المشاهدة
- `DELETE /api/watchlist/:workId` - حذف من قائمة المشاهدة

### Progress
- `GET /api/progress` - تقدم المشاهدة
- `POST /api/progress/:workId` - حفظ تقدم المشاهدة

### Ratings
- `GET /api/ratings` - التقييمات
- `POST /api/ratings/:workId` - إضافة تقييم
- `DELETE /api/ratings/:workId` - حذف تقييم

## Deployment

### Backend (Render)
1. اربط repository مع Render
2. اختر Node.js environment
3. أضف متغيرات البيئة (.env)
4. Deploy

### Frontend (Vercel)
1. اربط repository مع Vercel
2. اختر framework: Vite
3. أضف متغيرات البيئة
4. Deploy

## الترخيص

MIT License

## المساهمة

Pull requests مرحب بها! لتغييرات كبيرة، يرجى فتح issue أولاً لمناقشة التغييرات المقترحة.

## الدعم

للمساعدة والدعم، يرجى فتح issue في المستودع.

---

صُنع بـ ❤️ باستخدام React و Node.js و MongoDB
