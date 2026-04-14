import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://miskstores.com"; // استبدله برابط موقعك الفعلي عند الرفع

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/"], // منع أرشفة لوحة التحكم وطلبات الـ API
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
