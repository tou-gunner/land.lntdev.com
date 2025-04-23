"use client";

import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { ReduxProvider } from "./redux/provider";
import { FontLoader } from "./components/FontLoader";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./components/AuthProvider";
import { usePathname } from "next/navigation";
import ToastProvider from "./components/ToastProvider";

// Wrapper component to handle conditional Navbar rendering
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      <FontLoader />
      <ReduxProvider>
        <AuthProvider>
          <ThemeProvider defaultTheme="system" storageKey="land3-theme">
            {!isLoginPage && <Navbar />}
            <main className="mx-auto">{children}</main>
            <ToastProvider />
          </ThemeProvider>
        </AuthProvider>
      </ReduxProvider>
    </>
  );
}

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
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
