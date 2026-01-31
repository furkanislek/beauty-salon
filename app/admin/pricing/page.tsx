import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import DeleteButton from "@/components/admin/DeleteButton";
import Link from "next/link";

export default async function AdminPricingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: packages } = await supabase
    .from("pricing_packages")
    .select("*")
    .order("display_order", { ascending: true });

  const handleDelete = async (id: string) => {
    "use server";
    const supabase = await createClient();
    const table = supabase.from("pricing_packages") as any;
    await table.delete().eq("id", id);
    redirect("/admin/pricing");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Fiyatlandırma Paketleri
            </h1>
            <p className="text-gray-600 mt-1">
              Ana sayfa fiyat kartlarını yönetin
            </p>
          </div>
          <Link
            href="/admin/pricing/new"
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition"
          >
            + Yeni Paket Ekle
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Paket Adı
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Popüler
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Madde Sayısı
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {packages && packages.length > 0 ? (
                  packages.map(
                    (pkg: {
                      id: string;
                      name: string;
                      description: string | null;
                      price: number;
                      price_unit: string | null;
                      is_popular: boolean;
                      features: string[];
                    }) => (
                      <tr key={pkg.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">
                            {pkg.name}
                          </p>
                          {pkg.description && (
                            <p className="text-sm text-gray-500 mt-0.5">
                              {pkg.description}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">
                            ₺{Number(pkg.price).toLocaleString("tr-TR")}
                            {pkg.price_unit || "/ay"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {pkg.is_popular ? (
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                              En Popüler
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-600">
                            {Array.isArray(pkg.features)
                              ? pkg.features.length
                              : 0}{" "}
                            madde
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/pricing/${pkg.id}/edit`}
                              className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                              Düzenle
                            </Link>
                            <form action={handleDelete.bind(null, pkg.id)}>
                              <DeleteButton
                                confirmMessage="Bu paketi silmek istediğinizden emin misiniz?"
                                className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                              >
                                Sil
                              </DeleteButton>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ),
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Henüz paket eklenmemiş. Yeni paket eklemek için yukarıdaki
                      butona tıklayın.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
