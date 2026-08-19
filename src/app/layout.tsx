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

/**
 * Resolves the stored three-way preference (system/light/dark) to a concrete
 * theme and stamps it on <html>. Runs synchronously while the browser parses
 * the head, so the first paint is already in the right theme — see
 * https://nextjs.org/docs/app/guides/preventing-flash-before-hydration.
 * Keep in sync with `resolveTheme` in `components/theme-toggle.tsx`.
 */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light"}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className={`${jakarta.variable} scroll-smooth`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="bg-paper font-sans text-base font-medium text-ink">
        <PostHogProvider />
        <AnimatedGrid />
        {children}
      </body>
    </html>
  );
}
