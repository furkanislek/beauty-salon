import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import Link from "next/link";

const SECTIONS = [
  {
    title: "Ana sayfa bölümleri",
    items: [
      {
        href: "/admin/hero",
        label: "Hero",
        description: "Üst alan, başlık ve görsel",
        icon: "✨",
      },
      {
        href: "/admin/treatments",
        label: "Tedavi / Hizmetlerimiz",
        description: "Tedavi kartları ve Neden Bizi Seçmelisiniz",
        icon: "💆",
      },
      {
        href: "/admin/pricing",
        label: "Fiyatlandırma",
        description: "Fiyat paketleri",
        icon: "💰",
      },
      {
        href: "/admin/discount",
        label: "Kampanya",
        description: "İndirim alanı ve istatistikler",
        icon: "🏷️",
      },
    ],
  },
  {
    title: "İçerik",
    items: [
      {
        href: "/admin/blog",
        label: "Blog",
        description: "Blog yazıları",
        icon: "📝",
      },
    ],
  },
  {
    title: "Yönetim",
    items: [
      {
        href: "/admin/appointments",
        label: "Randevular",
        description: "Randevu listesi ve yönetimi",
        icon: "📅",
      },
    ],
  },
];

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50/80">
      <AdminNav />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Tüm bölümlere aşağıdaki kartlardan ulaşabilirsiniz.
          </p>
        </header>

        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {section.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow hover:border-pink-200 hover:bg-pink-50/30 transition-all duration-200"
                  >
                    <span
                      className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-lg bg-pink-50 text-pink-600 group-hover:bg-pink-100 text-xl"
                      aria-hidden
                    >
                      {item.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-gray-900 group-hover:text-pink-700 block truncate">
                        {item.label}
                      </span>
                      <span className="text-sm text-gray-500 line-clamp-1 block">
                        {item.description}
                      </span>
                    </div>
                    <span
                      className="flex-shrink-0 text-gray-300 group-hover:text-pink-400 transition-colors"
                      aria-hidden
                    >
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
