"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { isAuthenticated } from "./lib/auth";
import { createPath } from "./lib/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication status and redirect accordingly
    if (isAuthenticated()) {
      router.push(createPath("/documents-list"));
    } else {
      router.push(createPath("/login"));
    }
  }, [router]);

  // Show a simple loading state while redirecting
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto pt-12 text-center">
        <h1 className="text-4xl font-bold mb-6">ລະບົບຈັດການຂໍ້ມູນທີ່ດິນ</h1>
        <p className="text-xl mb-8">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
      </div>
    </main>
  );
}
