import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import ContactSettingsForm from "./ContactSettingsForm";
import type { ContactSettings } from "@/types/database";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: row } = await supabase
    .from("contact_settings")
    .select("*")
    .order("display_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  const contactSettings = row as ContactSettings | null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ayarlar</h1>
          <p className="text-gray-600 mt-1">
            İletişim bilgileri ve randevu bölümündeki sol alan metinleri buradan düzenlenir.
          </p>
        </div>
        <ContactSettingsForm initialData={contactSettings} />
      </div>
    </div>
  );
}
