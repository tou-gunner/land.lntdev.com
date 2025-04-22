"use client";

import Link from "next/link";
import { createPath } from "../lib/navigation";

type AppLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

/**
 * A wrapper around Next.js Link component that automatically handles the base path
 */
export default function AppLink({ href, children, ...props }: AppLinkProps) {
  return (
    <Link href={createPath(href)} {...props}>
      {children}
    </Link>
  );
} 