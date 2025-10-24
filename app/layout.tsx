import type { Metadata } from "next";
import "@/components/styles/globals.css"
import Navbar from "@/components/ui/Navbar";
import { Playfair_Display, Poppins } from "next/font/google";

// 🎨 Load fonts via Next.js
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Barber-App",
  description: "Application for manage documentation of barber customers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${poppins.variable} antialiased bg-gray-100 min-h-dvh flex flex-col`}
      >
        {/* Content */}
        <main className="flex-1 container mx-auto mt-6 px-4">
          {children}
        </main>

        {/* Navbar */}
        <nav className="sticky bottom-0 z-50">
          <Navbar/>
        </nav>
      </body>
    </html>
  );
}
