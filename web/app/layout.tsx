import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip"
import { TRPCProvider } from "@/trpc/react";
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MergeWise - AI-Powered GitHub Code Reviewer | Automate PR Reviews",
    template: "%s | MergeWise"
  },
  description: "Streamline your GitHub workflow with AI-powered code reviews. Get instant, intelligent feedback on pull requests, catch bugs early, and maintain code quality with MergeWise.",
  keywords: ["GitHub code review", "AI code reviewer", "PR automation", "code quality", "pull request review", "automated code review", "GitHub integration", "code analysis"],
  authors: [{ name: "MergeWise" }],
  creator: "MergeWise",
  publisher: "MergeWise",
  metadataBase: new URL("https://mergewise-ebon.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mergewise-ebon.vercel.app",
    title: "MergeWise - AI-Powered GitHub Code Reviewer | Automate PR Reviews",
    description: "Streamline your GitHub workflow with AI-powered code reviews. Get instant, intelligent feedback on pull requests, catch bugs early, and maintain code quality.",
    siteName: "MergeWise",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MergeWise - AI-Powered Code Review Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "MergeWise - AI-Powered GitHub Code Reviewer",
    description: "Streamline your GitHub workflow with AI-powered code reviews. Get instant, intelligent feedback on pull requests.",
    images: ["/og-image.png"],
    creator: "@mergewise"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-token",
  },
  appleWebApp: {
    capable: true,
    title: "Mergewise",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <TRPCProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
