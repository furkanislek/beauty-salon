import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import DeleteButton from "@/components/admin/DeleteButton";
import Link from "next/link";
import TreatmentSectionForm from "./TreatmentSectionForm";
import type { TreatmentProgram, TreatmentSection as TreatmentSectionType } from "@/types/database";

export default async function AdminTreatmentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const [
    { data: programs },
    { data: sectionRow },
  ] = await Promise.all([
    supabase
      .from("treatment_programs")
      .select("*")
      .order("display_order", { ascending: true }),
    supabase
      .from("treatment_section")
      .select("*")
      .order("display_order", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  const section = sectionRow as TreatmentSectionType | null;

  const handleDeleteProgram = async (id: string) => {
    "use server";
    const supabase = await createClient();
    await (supabase.from("treatment_programs") as any).delete().eq("id", id);
    redirect("/admin/treatments");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hizmetlerimiz / Tedavi</h1>
          <p className="text-gray-600 mt-1">
            Özel tedavi programları kartları ve &quot;Neden Bizi Seçmelisiniz?&quot; alanını yönetin
          </p>
        </div>

        {/* Neden Bizi Seçmelisiniz - tek kayıt */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Neden Bizi Seçmelisiniz? (alt bölüm)
          </h2>
          <TreatmentSectionForm initialData={section} />
        </div>

        {/* Tedavi programları listesi */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Tedavi Programları (kartlar)
            </h2>
            <Link
              href="/admin/treatments/programs/new"
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition"
            >
              + Yeni Program Ekle
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    İkon / Ad
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Açıklama
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {programs && (programs as TreatmentProgram[]).length > 0 ? (
                  (programs as TreatmentProgram[]).map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="mr-2 text-2xl" title={p.icon || ""}>
                          {p.icon || "•"}
                        </span>
                        <span className="font-medium text-gray-900">{p.name}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm max-w-xs truncate">
                        {p.description || "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/treatments/programs/${p.id}/edit`}
                            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            Düzenle
                          </Link>
                          <form action={handleDeleteProgram.bind(null, p.id)}>
                            <DeleteButton
                              confirmMessage="Bu programı silmek istediğinize emin misiniz?"
                              className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              Sil
                            </DeleteButton>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                      Henüz tedavi programı yok. &quot;Yeni Program Ekle&quot; ile ekleyin.
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
