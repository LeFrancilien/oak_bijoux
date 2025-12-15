import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OAK BIJOUX | Studio de Création IA pour Bijoutiers",
  description: "Générez des campagnes publicitaires ultra-réalistes par IA. Uploadez votre bijou, décrivez l'ambiance, et laissez l'IA créer le visuel parfait.",
  keywords: ["bijoux", "IA", "génération d'images", "campagne publicitaire", "mannequin IA"],
  openGraph: {
    title: "OAK BIJOUX | Studio de Création IA",
    description: "Campagnes publicitaires IA pour créateurs de bijoux",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
