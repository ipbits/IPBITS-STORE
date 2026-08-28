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
              <span className="text-rose-500">❤️</span>
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
                <svg className="w-3.5 h-3.5 text-fuchsia-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
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