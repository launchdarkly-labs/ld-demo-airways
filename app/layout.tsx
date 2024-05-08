import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { TripsProvider } from "@/utils/contexts/TripContext";
import LoginContext, { LoginProvider } from "@/utils/contexts/login";
import { v4 as uuidv4 } from "uuid";
import type { Viewport } from 'next'


const inter = Inter({ subsets: ["latin"] });

const AsyncLDProvider = dynamic(() => import("@/components/ldprovider"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "LaunchAirways",
  description: "LaunchAirways Sample App",
  // viewport: "width=device-width, initial-scale=1",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<div>Loading...</div>}>
          <AsyncLDProvider>
            <LoginProvider>
            <TripsProvider>{children}</TripsProvider>
            </LoginProvider>
          </AsyncLDProvider>
        </Suspense>
      </body>
    </html>
  );
}
