"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getCurrentUser, logout } from "../lib/auth";
import { createPath } from "../lib/navigation";
import { ThemeToggle } from "./ThemeToggle";
import AppLink from "./AppLink";
import { 
  LayoutDashboard, 
  Files, 
  FileType2, 
  LogOut, 
  LogIn,
  ArrowLeft
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);

  // Check if current page is document-types or document-forms
  const isDocumentDetailPage = pathname.includes('/document-types') || pathname.includes('/document-forms');

  // Get return parameters for back navigation if we're on a document detail page
  const returnTab = searchParams.get('returnTab') || 'type';
  const returnTypePage = searchParams.get('returnTypePage') || '1';
  const returnFormPage = searchParams.get('returnFormPage') || '1';
  const returnPerPage = searchParams.get('returnPerPage') || '10';
  const returnProvince = searchParams.get('returnProvince') || '';
  const returnDistrict = searchParams.get('returnDistrict') || '';
  const returnVillage = searchParams.get('returnVillage') || '';

  // Function to navigate back to documents list with preserved filters
  const handleBackToList = () => {
    const params = new URLSearchParams();
    params.set('tab', returnTab);
    params.set('typePage', returnTypePage);
    params.set('formPage', returnFormPage);
    params.set('perPage', returnPerPage);
    if (returnProvince) params.set('province', returnProvince);
    if (returnDistrict) params.set('district', returnDistrict);
    if (returnVillage) params.set('village', returnVillage);
    
    router.push(`/documents-list?${params.toString()}`);
  };

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

  // Helper function to determine if a link is active
  const isActiveLink = (path: string) => {
    return pathname === createPath(path);
  };

  const navLinks = [
    { name: "ແຜງຄວບຄຸມ", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "ເອກະສານ", path: "/documents-list", icon: <Files size={18} /> },
  ];

  return (
    <header className="sticky top-0 z-10 w-full p-4 flex justify-between items-center bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div className="text-xl font-bold text-blue-800 dark:text-blue-400">
            {isDocumentDetailPage ? (
              <div className="flex items-center">
                <ArrowLeft size={24} />
                <button 
                  onClick={handleBackToList}
                  className="text-base font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  ກັບຄືນໜ້າລາຍການ
                </button>
              </div>
            ) : (
              "ລະບົບທີ່ດິນ"
            )}
          </div>
        </div>

        {/* Navigation links */}
        {user && (
          <nav className="hidden md:flex items-center ml-6 space-x-4">
            {navLinks.map((link) => (
              <AppLink 
                key={link.path} 
                href={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActiveLink(link.path)
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                {link.icon}
                {link.name}
              </AppLink>
            ))}
          </nav>
        )}
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
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <LogOut size={18} />
              <span>ອອກຈາກລະບົບ</span>
            </button>
          </div>
        ) : (
          <AppLink href="/login">
            <div className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2">
              <LogIn size={18} />
              <span>ເຂົ້າສູ່ລະບົບ</span>
            </div>
          </AppLink>
        )}
      </div>
    </header>
  );
} 