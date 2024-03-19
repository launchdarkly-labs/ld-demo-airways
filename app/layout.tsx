import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { TripsProvider } from "@/utils/contexts/TripContext";
import LoginContext, { LoginProvider } from "@/utils/contexts/login";

const inter = Inter({ subsets: ["latin"] });

const AsyncLDProvider = dynamic(() => import("@/components/ldprovider"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "LaunchAirways",
  description: "LaunchAirways Sample App",
};

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