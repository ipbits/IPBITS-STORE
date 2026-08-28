import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { icons } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'IPBITS STORE | پلاتفۆڕما ژیرییا دەستکرد و خزمەتگوزاریێن دیجیتاڵ',
  description: 'دەستڤەئینانا ئەکاونت و پشکداریێن فەرمی ب کێمترین دەم و ب پشتەڤانییا بەردەوام',
  icons: {
    icon: '/icon.png',
   },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ku"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-[#070913] text-white`}
    >
      <body className="min-h-full bg-[#070913] text-slate-100 font-sans selection:bg-purple-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}