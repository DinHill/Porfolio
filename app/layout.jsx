import { Inter, Sora, JetBrains_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";
import { themeScript } from "@/lib/theme";
import { profile } from "@/data/portfolio";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["500", "600", "700", "800"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });
const script = Dancing_Script({ variable: "--font-script", subsets: ["latin"], weight: ["700"] });

export const metadata = {
  title: profile.tabTitle,
  description: profile.intro,
};

export const viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f6fa" },
    { media: "(prefers-color-scheme: dark)", color: "#07080d" },
  ],
};

// Shared by the portfolio (app/(site)) and the private dashboard (app/hq).
// data-theme is set by themeScript before paint, hence suppressHydrationWarning on <html>.
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${sora.variable} ${mono.variable} ${script.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
