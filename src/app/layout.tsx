import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { ReduxProvider } from "./redux/provider";
import { FontLoader } from "./components/FontLoader";
import Navbar from "./components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <FontLoader />
        <ReduxProvider>
          <ThemeProvider defaultTheme="system" storageKey="land3-theme">
            <Navbar />
            <main className="mx-auto pt-4 pb-12">{children}</main>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
