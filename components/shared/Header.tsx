"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Button from "./Button";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isBlog = pathname?.startsWith("/blog");

  const fullNavigation = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Hizmetler", href: "#services" },
    { name: "Fiyatlar", href: "#pricing" },
    { name: "Blog", href: "#blog" },
    { name: "İletişim", href: "#contact" },
  ];

  const navigation = isBlog
    ? [{ name: "Ana Sayfa", href: "/" }]
    : fullNavigation;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Beauty Salon Logo"
              width={180}
              height={60}
              priority
              className="h-12 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Button size="md">Randevu Al</Button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4">
              <Button size="md" className="w-full">
                Randevu Al
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
