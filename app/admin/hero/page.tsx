import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import HeroForm from "./HeroForm";
import type { HeroSection } from "@/types/database";

export default async function AdminHeroPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: row } = await supabase
    .from("hero_section")
    .select("*")
    .order("display_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  const hero = row as HeroSection | null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hero Alanı</h1>
          <p className="text-gray-600 mt-1">
            Ana sayfanın üst kısmındaki başlık, metin ve görseli buradan
            düzenleyin
          </p>
        </div>
        <HeroForm initialData={hero} />
      </div>
    </div>
  );
}
