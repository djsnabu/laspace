import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "La Space | Klubeja yökerhoihin",
  description:
    "La Space tuo yökerhoihin unohtumattomat klubikonseptit, huippu-DJ:t ja täydellisen viban. Ota yhteyttä ja suunnitellaan ilta.",
  openGraph: {
    title: "La Space | Klubeja yökerhoihin",
    description:
      "La Space tuo yökerhoihin unohtumattomat klubikonseptit, huippu-DJ:t ja täydellisen viban.",
    type: "website",
    url: "https://laspacefin.com",
    images: [{ url: "/assets/og-image.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "La Space | Klubeja yökerhoihin",
    description:
      "La Space tuo yökerhoihin unohtumattomat klubikonseptit, huippu-DJ:t ja täydellisen viban.",
    images: ["/assets/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi" className="scroll-smooth">
      <body className="antialiased bg-space-black text-white font-sans bg-grid">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
