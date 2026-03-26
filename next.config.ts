import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**", // ده بيسمح بجميع الصور المرفوعة على كلاوديناري
      },
    ],
  },
  // نصيحة إضافية: لو لسه بيجيلك تحذير الـ middleware،
  // تأكد من تغيير اسم ملف middleware.ts إلى proxy.ts كما طلب منك التحديث الأخير.
};

export default nextConfig;
