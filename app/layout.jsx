import { Inter, Jersey_15, Silkscreen, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { themeScript } from "@/lib/theme";
import { profile } from "@/data/portfolio";

// Jersey 15 for headings, Silkscreen for small pixel labels, Inter for reading text, JetBrains Mono for code-ish details.
// (Pixelify Sans was tried for headings, but its B, C and 5 read as G, O and S.)
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const pixel = Jersey_15({ variable: "--font-pixel", subsets: ["latin"], weight: "400" });
const label = Silkscreen({ variable: "--font-label", subsets: ["latin"], weight: ["400", "700"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata = {
  title: profile.tabTitle,
  description: profile.intro,
};

export const viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3eddc" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0c1d" },
  ],
};

// Shared by the portfolio (app/(site)) and the private dashboard (app/hq).
// data-theme is set by themeScript before paint, hence suppressHydrationWarning on <html>.
// The font variables go on <html> because the theme tokens on :root (globals.css) refer to them.
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${pixel.variable} ${label.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
