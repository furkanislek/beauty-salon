"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AdminNav from "@/components/admin/AdminNav";
import Link from "next/link";

const ICON_OPTIONS = [
  { value: "skin", label: "Cilt (yüz ikonu)" },
  { value: "massage", label: "Masaj (kalp)" },
  { value: "hair", label: "Saç (yıldız)" },
  { value: "nail", label: "Manikür (el)" },
  { value: "✨", label: "Emoji: ✨" },
  { value: "💆", label: "Emoji: 💆" },
  { value: "💇", label: "Emoji: 💇" },
  { value: "💅", label: "Emoji: 💅" },
];

export default function NewTreatmentProgramPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    icon: "skin",
    name: "",
    description: "",
    link_url: "#services",
    display_order: "0",
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error: insertError } = await (supabase.from("treatment_programs") as any).insert({
        icon: formData.icon,
        name: formData.name,
        description: formData.description || null,
        link_url: formData.link_url || "#services",
        display_order: parseInt(formData.display_order) || 0,
        is_active: formData.is_active,
      });
      if (insertError) throw insertError;
      router.push("/admin/treatments");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin/treatments" className="text-gray-600 hover:text-gray-900 text-sm font-medium mb-6 inline-block">
          ← Tedavi sayfasına dön
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Yeni Tedavi Programı</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">İkon</label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              {ICON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Emoji seçerseniz kartta emoji gösterilir; diğerleri SVG ikon kullanır.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="Cilt Bakımı"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="Profesyonel cilt analizi ve özel bakım programları"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Link (Detaylı Bilgi)</label>
            <input
              type="text"
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="#services"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sıra</label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">Aktif</label>
          </div>
          <div className="flex justify-end gap-4">
            <Link href="/admin/treatments" className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              İptal
            </Link>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold disabled:opacity-50">
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
