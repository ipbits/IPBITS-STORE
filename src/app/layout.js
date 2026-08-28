import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Heart, Instagram } from "lucide-react";

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
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ku"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-[#070913] text-white`}
    >
      <body className="min-h-full flex flex-col bg-[#070913] text-slate-100 font-sans selection:bg-purple-600 selection:text-white">
        
        {/* ناڤەرۆکا پەڕان */}
        <div className="flex-1">
          {children}
        </div>

        {/* فۆتەرێ جێگیر یێ ماڵپەری */}
        <footer className="border-t border-slate-800/80 bg-[#0c1022]/90 backdrop-blur-md py-6 px-6 mt-auto w-full z-20">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            
            <div className="flex items-center gap-2">
              <span>گەشەپێدای ب</span>
              <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
              <span>ژ لایێ</span>
              <span className="font-black text-purple-300">Peshwar Farhad</span>
            </div>

            <div className="flex items-center gap-4">
              <a 
                href="https://instagram.com/ipbits" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-purple-950/60 border border-purple-500/30 hover:border-purple-500/60 text-purple-300 px-3.5 py-1.5 rounded-xl font-bold transition-all shadow-sm hover:scale-105"
              >
                <Instagram size={14} className="text-fuchsia-400" />
                <span>@ipbits</span>
              </a>
              <span className="text-slate-600">|</span>
              <span>© IPBITS STORE. هەمی ماف پاراستینە.</span>
            </div>

          </div>
        </footer>

      </body>
    </html>
  );
}