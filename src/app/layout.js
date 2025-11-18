import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Header from "@/components/ui/Header";
import PageContainer from "@/components/ui/PageContainer";
import { LoaderProvider } from "@/components/ui/LoaderContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TrueFeed",
  description: "A social media platform for sharing true stories",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="tf-no-flash-theme" strategy="beforeInteractive">
          {`(() => {try {var t=localStorage.getItem('theme');var m=window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;var d = t==='dark' || (t==='system' ? m : (t==null ? m : false));document.documentElement.classList.toggle('dark', !!d);} catch(e) {}})();`}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoaderProvider>
          <Header />
          <PageContainer>{children}</PageContainer>
        </LoaderProvider>
      </body>
    </html>
  );
}
