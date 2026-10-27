import { Inter, Sora, JetBrains_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Effects from "@/components/Effects";
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
  themeColor: "#07080d",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sora.variable} ${mono.variable} ${script.variable} antialiased`}>
        <a className="skip-link" href="#main">Skip to content</a>
        <Effects />
        <Nav />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
