"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../lib/auth";

interface AuthCheckProps {
  children: React.ReactNode;
}

export default function AuthCheck({ children }: AuthCheckProps) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Redirect to login page if not authenticated
      router.push("/login");
    }
  }, [router]);

  // If user is authenticated, render children
  return <>{children}</>;
}

// Higher-order component to wrap any page that requires authentication
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function WithAuth(props: P) {
    return (
      <AuthCheck>
        <Component {...props} />
      </AuthCheck>
    );
  };
} 