import { Geist, Geist_Mono } from "next/font/google";
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
  title: 'IPBITS STORE | باشترین خزمەتگوزاریێن دیجیتال و ژیرییا دەستکرد',
  description: 'دەستڤەئینانا ئەکاونت و پشکداریێن فەرمی ب کێمترین دەم و ب پشتەڤانییا بەردەوام',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
