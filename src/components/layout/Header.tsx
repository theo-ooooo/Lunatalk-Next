"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User, Menu, Search, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/services/api";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getCategories,
    staleTime: 1000 * 60 * 5,
  });

  const handleLogout = () => {
    logout();
    router.push("/");
    router.refresh();
  };

  const categoryList = Array.isArray(categories)
    ? categories.filter((c) => c.visibility === "VISIBLE")
    : [];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="https://admin.lunatalk.co.kr/static/media/logo.e0e49014f4ed6f070031.jpg"
            alt="LUNATALK"
            width={120}
            height={40}
            className="object-contain h-8 md:h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-600">
          {categoryList.length > 0 ? (
            categoryList.map((category) => (
              <Link
                key={category.categoryId}
                href={`/products?categoryId=${category.categoryId}`}
                className="hover:text-slate-900 hover:font-bold transition-all"
              >
                {category.categoryName}
              </Link>
            ))
          ) : (
            <div className="flex gap-4">
              <div className="w-16 h-4 bg-gray-100 rounded animate-pulse"></div>
              <div className="w-16 h-4 bg-gray-100 rounded animate-pulse"></div>
              <div className="w-16 h-4 bg-gray-100 rounded animate-pulse"></div>
            </div>
          )}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-2 md:gap-4 text-slate-800">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Search className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" />
          </button>

          <Link
            href="/cart"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
          >
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" />
          </Link>

          {mounted && isAuthenticated ? (
            <div className="flex items-center gap-1 md:gap-2">
              <Link
                href="/mypage"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <User className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-slate-500"
                title="로그아웃"
              >
                <LogOut className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md"
            >
              로그인
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-full ml-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6 stroke-[1.5]" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 p-4 space-y-2 bg-white animate-in slide-in-from-top-2">
          {categoryList.map((category) => (
            <Link
              key={category.categoryId}
              href={`/products?categoryId=${category.categoryId}`}
              className="block text-[15px] font-medium p-3 hover:bg-gray-50 rounded-xl text-slate-700"
              onClick={() => setIsMenuOpen(false)}
            >
              {category.categoryName}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
