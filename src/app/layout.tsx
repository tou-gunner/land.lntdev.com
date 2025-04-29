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
import { Suspense } from "react";

// Fallback for Navbar when it's loading
function NavbarFallback() {
  return (
    <header className="sticky top-0 z-10 w-full p-4 flex justify-between items-center bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
      <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
    </header>
  );
}

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
            {!isLoginPage && (
              <Suspense fallback={<NavbarFallback />}>
                <Navbar />
              </Suspense>
            )}
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
