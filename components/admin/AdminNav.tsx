"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/hero", label: "Hero", icon: "✨" },
  { href: "/admin/treatments", label: "Tedavi", icon: "💆" },
  { href: "/admin/pricing", label: "Fiyatlandırma", icon: "💰" },
  { href: "/admin/discount", label: "Kampanya", icon: "🏷️" },

  { href: "/admin/blog", label: "Blog", icon: "📝" },
  { href: "/admin/appointments", label: "Randevular", icon: "📅" },
  { href: "/admin/settings", label: "Ayarlar", icon: "⚙️" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const linkClass = (href: string) =>
    pathname === href
      ? "bg-pink-100 text-pink-700"
      : "text-gray-600 hover:bg-gray-100";

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center gap-6">
            <Link
              href="/admin/dashboard"
              className="text-xl font-bold text-gray-900 whitespace-nowrap"
            >
              Admin
            </Link>
            <div className="hidden lg:flex items-center gap-0.5 justify-center">
              <div className="flex items-center gap-0.5 justify-center">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${linkClass(
                      item.href,
                    )}`}
                  >
                    <span className="mr-1.5">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Menüyü aç"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
            >
              Çıkış
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-0.5 max-h-[70vh] overflow-y-auto">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${linkClass(
                  item.href,
                )}`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
