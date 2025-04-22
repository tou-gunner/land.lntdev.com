"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout } from "../lib/auth";
import { createPath } from "../lib/navigation";
import { ThemeToggle } from "./ThemeToggle";
import AppLink from "./AppLink";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    // Use router.push with the base path included
    router.push(createPath('/login'));
  };

  return (
    <header className="sticky top-0 z-10 w-full p-4 flex justify-between items-center bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="text-xl font-bold text-blue-800 dark:text-blue-400">
          ລະບົບທີ່ດິນ
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        {user ? (
          <div className="flex items-center space-x-4">
            <div className="text-gray-800 dark:text-gray-200">
              {user.full_name}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              ອອກຈາກລະບົບ
            </button>
          </div>
        ) : (
          <AppLink href="/login">
            <div className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              ເຂົ້າສູ່ລະບົບ
            </div>
          </AppLink>
        )}
      </div>
    </header>
  );
} 