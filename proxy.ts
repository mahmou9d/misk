import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// تم تغيير اسم الدالة من middleware إلى proxy
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // توجيه الصفحة الرئيسية إلى اللغة العربية بشكل افتراضي
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/ar";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// تأكد من إضافة الـ config لو كنت تريد تحديد مسارات معينة فقط
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
