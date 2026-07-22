import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/context/AudioContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nosso Tempo Juntos ❤️",
  description: "Uma homenagem especial cheia de memórias, carinho e cada segundo compartilhado juntos. Feliz Dia dos Namorados!",
  openGraph: {
    title: "Nosso Tempo Juntos ❤️",
    description: "Uma homenagem especial cheia de memórias, carinho e cada segundo compartilhado juntos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${outfit.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-[#b1d0e9] overflow-x-hidden font-sans">
        <AudioProvider>
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}
