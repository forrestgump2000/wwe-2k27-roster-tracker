import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
  title: { default: "WWE 2K27 Roster Tracker", template: "%s · WWE 2K27 Roster Tracker" },
  description: "The community-powered WWE 2K27 roster tracker. Add confirmed superstars with proof, see their rating history and every game they've been in, and predict their 2K27 ratings.",
  applicationName: "WWE 2K27 Roster Tracker",
};
export const viewport: Viewport = { themeColor: "#060609" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable}`}>
      <body>
        <header className="hdr">
          <div className="wrap">
            <Link href="/" className="brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/apple-icon" alt="" />
              <span className="brand-txt"><b>WWE <span>2K27</span></b><small>Roster Tracker</small></span>
            </Link>
            <span className="live"><i />Live community roster</span>
          </div>
        </header>
        <main>{children}</main>
        <footer className="foot">
          <div className="wrap">
            Fan-made project. Not affiliated with, endorsed or sponsored by WWE, 2K or Visual Concepts — all trademarks belong to their owners.
            Superstar photos are loaded from Wikipedia / Wikimedia Commons under their respective free licenses. Ratings history is community-compiled and may be approximate.
            Roster entries, predictions and reports are submitted by users.
          </div>
        </footer>
      </body>
    </html>
  );
}
