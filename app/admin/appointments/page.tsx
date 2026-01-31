import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import NoteModalButton from "@/components/admin/NoteModalButton";
import type { Database } from "@/types/database";

export default async function AdminAppointmentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .order("appointment_date", { ascending: false });

  const updateStatus = async (
    id: string,
    status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show",
  ) => {
    "use server";
    const supabase = await createClient();
    const updateData: Database["public"]["Tables"]["appointments"]["Update"] = {
      status,
    };
    // Supabase'ın TypeScript tipleri bu satırda `never` üretiyor, bu yüzden tabloyu `any` olarak cast ediyoruz.
    const appointmentsTable = supabase.from("appointments") as any;
    await appointmentsTable.update(updateData).eq("id", id);
    redirect("/admin/appointments");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Randevu Yönetimi
        </h1>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Müşteri
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Tarih
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Saat
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Telefon
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  E-posta
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Durum
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {appointments && appointments.length > 0 ? (
                appointments.map((apt: any) => (
                  <tr key={apt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{apt.full_name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">
                        {new Date(apt.appointment_date).toLocaleDateString(
                          "tr-TR",
                        )}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{apt.appointment_time}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{apt.phone || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{apt.email || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      {apt.status === "confirmed" && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          Onaylandı
                        </span>
                      )}
                      {apt.status === "pending" && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                          Bekliyor
                        </span>
                      )}
                      {apt.status === "cancelled" && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                          İptal
                        </span>
                      )}
                      {apt.status === "completed" && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          Tamamlandı
                        </span>
                      )}
                      {apt.status === "no_show" && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          Gelmedi
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        <NoteModalButton note={apt.notes} />
                        {apt.status === "pending" && (
                          <form
                            action={updateStatus.bind(
                              null,
                              apt.id,
                              "confirmed",
                            )}
                          >
                            <button className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg">
                              Onayla
                            </button>
                          </form>
                        )}
                        {apt.status !== "cancelled" && (
                          <form
                            action={updateStatus.bind(
                              null,
                              apt.id,
                              "cancelled",
                            )}
                          >
                            <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                              İptal
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Henüz randevu yok
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
