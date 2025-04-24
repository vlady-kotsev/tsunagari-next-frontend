import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Providers } from "@/app/providers/providers";
import { Toaster } from "@/components/atoms/sonner";

const bebasNeue = localFont({
  src: [
    {
      path: "./fonts/BebasNeue-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-bebas",
});
export const eduFont = localFont({
  src: [
    {
      path: "./fonts/EduAUVICWANTArrows-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/EduAUVICWANTArrows-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/EduAUVICWANTArrows-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/EduAUVICWANTArrows-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-edu",
});

export const metadata: Metadata = {
  title: "つながり",
  description: "Crypto bridge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bebasNeue.className} antialiased bg-gray-900`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
