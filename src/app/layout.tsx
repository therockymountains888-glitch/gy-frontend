import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const sans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans",
});

const serif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-noto-serif",
});

export const metadata: Metadata = {
  title: {
    default: "郭扬的笔记",
    template: "%s · 郭扬的笔记",
  },
  description: "郭扬用来学习和记录的私人站点",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN">
      <body
        className={`${sans.variable} ${serif.variable} min-h-screen font-sans antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
