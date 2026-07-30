import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import AnimatedGrid from "@/components/animated-grid";
import SitePointer from "@/components/site-pointer";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hoperogan.com"),
  title: "Hope Elizabeth Rogan",
  description: "Product management and engineering portfolio for Hope Elizabeth Rogan.",
  openGraph: {
    title: "Hope Elizabeth Rogan",
    description: "Product management and engineering portfolio for Hope Elizabeth Rogan.",
    url: "https://hoperogan.com",
    siteName: "Hope Elizabeth Rogan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hope Elizabeth Rogan",
    description: "Product management and engineering portfolio for Hope Elizabeth Rogan.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} scroll-smooth`}>
      <body className="bg-paper font-sans text-base font-medium text-ink">
        <AnimatedGrid />
        <SitePointer />
        {children}
      </body>
    </html>
  );
}
