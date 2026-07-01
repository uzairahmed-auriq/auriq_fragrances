import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CartProvider } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { publicSettingsService } from "./services/publicSettingsService";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auriq | Essence In Motion",
  description: "A premium fragrance experience crafted for those who appreciate elegance, sophistication, and timeless luxury.",
  icons: {
    icon: "/favicon-small.png",
  },
  openGraph: {
    title: "Auriq | Essence In Motion",
    description: "A premium fragrance experience crafted for those who appreciate elegance, sophistication, and timeless luxury.",
    url: "https://auriqfragrances.com",
    siteName: "Auriq",
    images: [
      {
        url: "/icon.png",
        width: 553,
        height: 553,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Auriq | Essence In Motion",
    description: "A premium fragrance experience crafted for those who appreciate elegance, sophistication, and timeless luxury.",
    images: ["/icon.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialSettings = await publicSettingsService.getSettingsByGroup("HOMEPAGE").catch(() => ({}));

  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${bodoni.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground font-medium">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'}>
          <CartProvider>
            <SettingsProvider initialSettings={initialSettings}>
              {children}
            </SettingsProvider>
            <Analytics />
            <SpeedInsights />
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
          </CartProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
