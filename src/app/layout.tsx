import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import AnimatedGrid from "@/components/animated-grid";
import PostHogProvider from "@/components/posthog-provider";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hoperogan.com"),
  title: "Hope Rogan",
  description: "Product Management and Engineering Portfolio for Hope E. Rogan.",
  openGraph: {
    title: "Hope E. Rogan",
    description: "Product Management and Engineering Portfolio for Hope E. Rogan.",
    url: "https://hoperogan.com",
    siteName: "Hope E. Rogan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hope E. Rogan",
    description: "Product Management and Engineering Portfolio for Hope E. Rogan.",
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
        <PostHogProvider />
        <AnimatedGrid />
        {children}
      </body>
    </html>
  );
}
