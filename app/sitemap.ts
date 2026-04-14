import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://miskstores.com' // استبدله برابط موقعك الفعلي
  const locales = ['ar', 'en']

  // القائمة الأساسية للمسارات الثابتة في الموقع
  const staticRoutes = [
    '',
    '/search',
    '/orderhistory',
    '/businesshourslocation',
    '/pages/return-policy',
    '/privacy-policy',
    '/terms',
  ]

  // توليد الروابط لكل لغة مدعومة
  const routes = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : 0.8,
    }))
  )

  /* 
     ملاحظة للمستقبل: 
     لجعل الـ Sitemap شاملاً، يمكنك جلب المنتجات (Products) والأقسام (Categories) 
     من قاعدة البيانات هنا وإضافتها بنفس الطريقة.
  */

  return [...routes]
}