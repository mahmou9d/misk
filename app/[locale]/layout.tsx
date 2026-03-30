// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Cairo, Roboto } from "next/font/google";

const locales = ["en", "ar"] as const;
type Locale = (typeof locales)[number];

const BASE_URL = "https://perfume-site-bee1.vercel.app";

// ─── Fonts ────────────────────────────────────────────────────────────────────
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "700"],
  variable: "--font-cairo",
  display: "swap",
});

// ─── Translations ─────────────────────────────────────────────────────────────
const translations = {
  en: {
    title: "Misk Fragrances | Luxury Extrait De Parfum — Egypt",
    description:
      "Discover Misk's exclusive collection of Extrait De Parfum. 30–35% concentration, 8–14 hours longevity. Free shipping on orders over 2,000 EGP. Shop men's & women's fragrances.",
  },
  ar: {
    title: "مسك للعطور | عطور Extrait De Parfum الفاخرة — مصر",
    description:
      "اكتشف كولكشن مسك الحصري من عطور Extrait De Parfum بتركيز ٣٠–٣٥٪ وثبات ٨–١٤ ساعة. شحن مجاني للطلبات فوق ٢٠٠٠ جنيه. عطور رجالية ونسائية.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = (
    locales.includes(locale as Locale) ? locale : "en"
  ) as Locale;
  const t = translations[resolvedLocale];
  const isArabic = resolvedLocale === "ar";
  const pageUrl = `${BASE_URL}/${resolvedLocale}`;

  return {
    title: {
      default: t.title,
      template: isArabic ? "%s | مسك للعطور" : "%s | Misk Fragrances",
    },

    description: t.description,

    keywords: isArabic
      ? [
          "عطور فاخرة مصر",
          "Extrait De Parfum",
          "عطور رجالية",
          "عطور نسائية",
          "متجر عطور اونلاين",
          "عطور ثبات عالي",
          "شحن مجاني مصر",
          "كولكشن عطور",
          "مسك للعطور",
          "عطور احترافية",
        ]
      : [
          "luxury perfumes Egypt",
          "Extrait De Parfum",
          "men's fragrances",
          "women's fragrances",
          "online perfume store Egypt",
          "long lasting perfume",
          "free shipping Egypt",
          "fragrance collection",
          "Misk Fragrances",
          "premium perfumes",
        ],

    authors: [{ name: "Misk Fragrances", url: BASE_URL }],
    creator: "Misk Fragrances",
    publisher: "Misk Fragrances",

    alternates: {
      canonical: pageUrl,
      languages: {
        "en-US": `${BASE_URL}/en`,
        "ar-EG": `${BASE_URL}/ar`,
        "x-default": `${BASE_URL}/en`,
      },
    },

    openGraph: {
      type: "website",
      locale: isArabic ? "ar_EG" : "en_US",
      alternateLocale: isArabic ? "en_US" : "ar_EG",
      url: pageUrl,
      siteName: isArabic ? "مسك للعطور" : "Misk Fragrances",
      title: t.title,
      description: t.description,
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: isArabic
            ? "مسك للعطور — عطور Extrait De Parfum الفاخرة"
            : "Misk Fragrances — Luxury Extrait De Parfum",
          type: "image/png",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
      images: [`${BASE_URL}/og-image.png`],
      creator: "@miskfragrances",
      site: "@miskfragrances",
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        {
          url: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          url: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
    },

    verification: {
      google: "YOUR_GOOGLE_VERIFICATION_CODE",
    },

    category: "shopping",

    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Store",
        name: isArabic ? "مسك للعطور" : "Misk Fragrances",
        description: t.description,
        url: pageUrl,
        image: `${BASE_URL}/og-image.png`,
        logo: `${BASE_URL}/logo.png`,
        inLanguage: isArabic ? "ar-EG" : "en-US",
        currenciesAccepted: "EGP",
        paymentAccepted: "Cash, Credit Card, Mobile Wallet",
        priceRange: "$$",

        address: {
          "@type": "PostalAddress",
          addressLocality: isArabic ? "القاهرة" : "Cairo",
          addressRegion: isArabic ? "القاهرة الجديدة" : "New Cairo",
          addressCountry: "EG",
        },

        contactPoint: {
          "@type": "ContactPoint",
          email: "Misk@gmail.com",
          contactType: "customer service",
          availableLanguage: ["Arabic", "English"],
          areaServed: "EG",
        },

        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: isArabic ? "كولكشن مسك" : "Misk Collection",
          itemListElement: [
            {
              "@type": "OfferCatalog",
              name: isArabic ? "عطور رجالية" : "Men's Fragrances",
            },
            {
              "@type": "OfferCatalog",
              name: isArabic ? "عطور نسائية" : "Women's Fragrances",
            },
          ],
        },

        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "50",
          bestRating: "5",
          worstRating: "1",
        },

        sameAs: [
          "https://facebook.com/miskfragrances",
          "https://instagram.com/miskfragrances",
          "https://twitter.com/miskfragrances",
        ],
      }),
    },
  };
}

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return (
    <div
      className={`${roboto.variable} ${cairo.variable}`}
      style={{
        fontFamily: isArabic
          ? "var(--font-cairo), sans-serif"
          : "var(--font-roboto), sans-serif",
      }}
    >
      {children}
    </div>
  );
}
