import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Mão Amiga | Crowdfunding Social",
  description: "Pequenos gestos, grandes mudanças. A plataforma de vaquinhas online com taxa zero e foco em solidariedade.",
  openGraph: {
    title: "Mão Amiga | Crowdfunding Social",
    description: "Pequenos gestos, grandes mudanças. Ajude quem precisa ou crie sua campanha gratuitamente.",
    url: "https://maoamiga.com.br", // URL canônica (idealmente deve ser configurada via env var)
    siteName: "Mão Amiga",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mão Amiga | Crowdfunding Social",
    description: "Pequenos gestos, grandes mudanças. Ajude quem precisa ou crie sua campanha gratuitamente.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={cn(inter.variable, "min-h-screen flex flex-col font-sans antialiased")}>
        <Navbar />
        <main className="flex-1 pt-8 pb-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
