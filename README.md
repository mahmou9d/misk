# Misk Perfume — مسك للعطور 🌸✨

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

---

## 📖 جدول المحتويات / Table of Contents
1. [عن المشروع / About The Project](#-عن-المشروع--about-the-project)
2. [الميزات الرئيسية / Key Features](#-الميزات-الرئيسية--key-features)
3. [التقنيات المستخدمة / Tech Stack](#-التقنيات-المستخدمة--tech-stack)
4. [هيكلية المشروع / Project Structure](#-هيكلية-المشروع--project-structure)
5. [آلية العمل والربط مع الخادم / Architecture & API Client](#-آلية-العمل-والربط-مع-الخادم--architecture--api-client)
6. [التشغيل والتهيئة / Getting Started](#-التشغيل-والتهيئة--getting-started)
7. [أهم المتغيرات البيئية / Environment Variables](#-أهم-المتغيرات-البيئية--environment-variables)

---

## 📝 عن المشروع / About The Project

### باللغة العربية:
**مسك للعطور (Misk Perfume)** هو منصة تجارة إلكترونية متكاملة وحديثة متخصصة في بيع العطور الفاخرة. تم بناء واجهة المستخدم باستخدام أحدث تقنيات الويب مثل **Next.js 16** و **React 19** مع الاعتماد على **Tailwind CSS v4** للتصميم العصري و **Framer Motion** لإضافة لمسات حركية وتفاعلية تمنح المستخدم تجربة تسوق ممتعة ومميزة. يدعم الموقع اللغتين العربية والإنجليزية بشكل كامل ويوفر لوحة تحكم إدارية شاملة لإدارة المنتجات، الطلبات، والعملاء.

### In English:
**Misk Perfume** is a premium, fully-featured e-commerce platform dedicated to luxury fragrances. The frontend is built using the latest web technologies, including **Next.js 16** (App Router), **React 19**, and **Tailwind CSS v4** for clean, modern layouts. Dynamic animations are handled via **Framer Motion** to offer a luxurious and engaging user experience. The application features complete localization support (Arabic & English) and includes a comprehensive admin dashboard to manage products, categories, orders, banners, and store configurations.

---

## ⚡ الميزات الرئيسية / Key Features

### 🛒 تجربة المستخدم والعميل (Storefront Experience)
- **دعم كامل للغات (Internationalization - i18n):** تبديل سلس ورائع بين اللغتين العربية والإنجليزية باستخدام مكتبة `next-intl` مع روابط مخصصة لكل لغة (مثل `/ar/shop` و `/en/shop`).
- **نظام بحث وتصفية متقدم (Search & Filtering):** إمكانية البحث عن المنتجات وتصفيتها حسب التصنيفات أو المجموعات (Collections) بطريقة تفاعلية وسريعة.
- **سلة مشتريات ديناميكية (Dynamic Cart Drawer):** لوحة جانبية منزلقة للسلة تتيح تعديل الكميات وحساب الإجمالي فورياً ودعم الحفاظ على السلة للزوار غير المسجلين عبر معرّف الجهاز `X-Device-ID`.
- **قائمة الأمنيات (Wishlist):** تمكين المستخدمين من حفظ عطورهم المفضلة للعودة إليها لاحقاً.
- **بوابات دفع متعددة (Payment Integrations):** تكامل مع بوابات دفع شهيرة مثل **Paymob** و **PayPal** لإتمام عملية الدفع بأمان وسهولة.
- **تسجيل دخول مرن (Flexible Authentication):** يدعم تسجيل الدخول التقليدي بالبريد وكلمة المرور، بالإضافة لتسجيل الدخول السريع عبر جوجل (**Google OAuth**).
- **زر واتساب سريع (WhatsApp Quick Chat):** زر عائم ثابت يتيح للعملاء التواصل المباشر مع الدعم الفني للاستفسارات السريعة.

### 💼 لوحة تحكم المسؤول (Admin Dashboard)
- **إحصائيات عامة (Overview Page):** رسوم بيانية وتقارير ملخصة لأداء المبيعات، عدد الطلبات، والمستخدمين النشطين.
- **إدارة المحتوى (CMS):** إمكانية إضافة وتعديل وحذف المنتجات والتصنيفات (Categories) والمجموعات (Collections).
- **إدارة الطلبات (Orders Management):** متابعة تفصيلية لحالة الطلبات وتحديثها وتاريخ المعاملات.
- **اللافتات الإعلانية (Banners Management):** التحكم في البنرات المعروضة في الصفحة الرئيسية لتسويق العروض الموسمية.

---

## 🛠️ التقنيات المستخدمة / Tech Stack

تم اختيار التقنيات بعناية لضمان الأداء العالي، الأمان، والتصميم العصري:

| التقنية / Library | الاستخدام / Purpose |
| :--- | :--- |
| **Next.js 16 (App Router)** | إطار العمل الأساسي للـ React ودعم الـ SSR و Routing |
| **React 19** | أحدث إصدار من مكتبة React لبناء واجهات تفاعلية |
| **TypeScript** | لكتابة أكواد برمجية متينة وخالية من الأخطاء النوعية |
| **Tailwind CSS v4** | لتصميم الواجهات بمرونة تامة واستخدام أحدث خصائص الـ CSS |
| **Framer Motion** | لإضافة تأثيرات بصرية وانتقالات حركية ناعمة وفاخرة |
| **TanStack Query v5** | لإدارة حالات جلب البيانات وكاش البيانات (Server State Management) |
| **Axios** | لإجراء الطلبات وربط الواجهة مع الـ API الخاص بالخادم |
| **next-intl** | للترجمة والدعم الثنائي للغات (العربية والإنجليزية) |
| **React Hook Form** | لإدارة النماذج والتحقق من المدخلات بالتكامل مع `@hookform/resolvers` |
| **Lucide React** | لتوفير مجموعة واسعة من الأيقونات العصرية والخفيفة |
| **Cloudinary** | لتخزين واستضافة صور المنتجات بجودة عالية وسرعة استجابة |

---

## 📂 هيكلية المشروع / Project Structure

يتبع المشروع هيكلية منظمة تسهّل صيانة وتطوير الشيفرة البرمجية:

```bash
muskperfume/
├── app/                  # مجلد الراوتر والصفحات الخاص بـ Next.js
│   ├── [locale]/         # المسار الديناميكي للغات (عربي / إنجليزي)
│   │   ├── admin/        # صفحات لوحة التحكم
│   │   ├── shop/         # صفحات المتجر وعرض المنتجات
│   │   ├── checkout/     # صفحة الدفع وإتمام الطلب
│   │   └── ...           # باقي الصفحات (التسجيل، تسجيل الدخول، إلخ)
│   ├── globals.css       # الأنماط والتنسيقات العامة للموقع
│   └── layout.tsx        # التصميم الهيكلي الرئيسي للموقع
├── components/           # المكونات الفرعية القابلة لإعادة الاستخدام
│   ├── admin/            # مكونات لوحة التحكم
│   ├── layout/           # الهيدر، الفوتر، السلة الجانبية، وزر الواتساب
│   ├── sections/         # الأقسام الكبيرة بالصفحات (البطل، المنتجات، الدفع)
│   └── ui/               # مكونات الواجهة الصغيرة الأساسية (الزر، المدخلات، الخ)
├── hooks/                # خطافات مخصصة (Custom Hooks) مثل useCart, useAuth, useProducts
├── api/                  # الدوال والملفات الخاصة باستدعاء الـ APIs لكل موديول
├── lib/                  # إعدادات العملاء مثل apiClient و storage وسياق التصنيفات
│   └── apiClient.ts      # إعداد Axios و Interceptors لإعادة تجديد التوكين تلقائياً (JWT)
├── locales/              # ملفات الترجمة (ar.json / en.json)
├── utils/                # دوال مساعدة وللتحقق من صحة البيانات (Validation)
├── type/                 # واجهات وأنواع الـ TypeScript
├── public/               # الملفات الثابتة والصور والأيقونات
├── next.config.ts        # ملف إعدادات Next.js
└── package.json          # الاعتمادات ومكتبات المشروع
```

---

## 🔄 آلية العمل والربط مع الخادم / Architecture & API Client

تتم جميع الاتصالات بالخادم الخلفي عبر ملف إعدادات [apiClient.ts](file:///d:/Newfolder/work/muskperfume/lib/apiClient.ts) المعتمد على **Axios**:
1. **Request Interceptor:** يقوم تلقائياً بإرفاق توكين المصادقة (`Bearer Token`) في الترويسات (Headers) عند وجوده، بالإضافة إلى إرسال لغة المستخدم الحالية `Accept-Language` ومعرّف الجهاز `x-Device-ID` للمحافظة على محتويات السلة للزوار.
2. **Response Interceptor:** في حال انتهت صلاحية التوكين وحصل الموقع على الخطأ `401 Unauthorized`، يقوم العميل تلقائياً بطلب تحديث للتوكين (`Token Refresh`) عبر إرسال الـ `refresh token` للخادم الخلفي، ومن ثم إعادة محاولة الطلب الأصلي دون أن يشعر المستخدم بأي مقاطعة لتجربته.

---

## 🚀 التشغيل والتهيئة / Getting Started

لتشغيل المشروع محلياً على جهازك، اتبع الخطوات التالية:

### 1. المتطلبات الأساسية (Prerequisites)
تأكد من تثبيت بيئة عمل [Node.js](https://nodejs.org/) (يُفضل إصدار 18 فما فوق).

### 2. تثبيت الحزم (Installation)
قم بتثبيت الاعتمادات المطلوبة عبر تشغيل الأمر التالي في سطر الأوامر:
```bash
npm install
```

### 3. إعداد البيئة (Environment Variables)
قم بإنشاء ملف `.env.local` في المجلد الرئيسي للمشروع وأضف المتغيرات التالية (راجع المقطع أدناه بالتفصيل).

### 4. تشغيل خادم التطوير (Development Server)
لتشغيل المشروع في بيئة التطوير المحلية:
```bash
npm run dev
```
افتح الرابط [http://localhost:3000](http://localhost:3000) في متصفحك لمشاهدة الموقع مباشرة.

### 5. بناء المشروع للإنتاج (Production Build)
لبناء نسخة إنتاجية محسنة وسريعة:
```bash
npm run build
# بعد البناء، يمكنك تشغيل النسخة المبنية محلياً بـ:
npm run start
```

---

## 🔑 أهم المتغيرات البيئية / Environment Variables

لضمان عمل الموقع بشكل صحيح، يجب تهيئة المتغيرات البيئية التالية في ملف `.env.local`:

```env
# رابط الخادم الخلفي (API Base URL)
NEXT_PUBLIC_BASE_URL=https://misk-production.up.railway.app/api

# معرف العميل لتسجيل الدخول بجوجل (Google Client ID)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

---

*تم إعداد هذا الملف لتسهيل عملية الفهم والبدء في تطوير مشروع مسك للعطور. بالتوفيق! 🚀*
