import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/utils/QueryProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CatsProvider } from "@/lib/CatsContext";

const assistant = Assistant({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Misk — Luxury Perfumes",
  description: "Luxury Reimagined in Every Drop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${assistant.className} antialiased`}>
        <QueryProvider>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
          >
            <CatsProvider>{children}</CatsProvider>
          </GoogleOAuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
