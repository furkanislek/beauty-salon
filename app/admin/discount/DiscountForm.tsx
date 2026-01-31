"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { DiscountSection, DiscountSectionStat } from "@/types/database";

export default function DiscountForm({
  initialData,
}: {
  initialData: DiscountSection | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    badge_text: "Özel Kampanya",
    title: "İlk Randevunuzda %30 İndirim",
    subtitle: "Yeni müşterilerimize özel! Tüm hizmetlerde geçerli tek seferlik indirim fırsatı",
    cta_text: "Hemen Randevu Al",
    cta_url: "#contact",
    details_text: "Kampanya Detayları",
    details_url: "",
    is_active: true,
    display_order: "0",
  });
  const [stats, setStats] = useState<DiscountSectionStat[]>([
    { value: "500+", label: "Mutlu Müşteri" },
    { value: "4.9/5", label: "Müşteri Memnuniyeti" },
    { value: "15+", label: "Yıllık Deneyim" },
    { value: "50+", label: "Hizmet Çeşidi" },
  ]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        badge_text: initialData.badge_text ?? "Özel Kampanya",
        title: initialData.title,
        subtitle: initialData.subtitle ?? "",
        cta_text: initialData.cta_text ?? "Hemen Randevu Al",
        cta_url: initialData.cta_url ?? "#contact",
        details_text: initialData.details_text ?? "Kampanya Detayları",
        details_url: initialData.details_url ?? "",
        is_active: initialData.is_active,
        display_order: String(initialData.display_order),
      });
      const s = initialData.stats;
      setStats(
        Array.isArray(s) && s.length > 0
          ? s.map((x) => ({ value: x?.value ?? "", label: x?.label ?? "" }))
          : [{ value: "", label: "" }]
      );
    }
  }, [initialData]);

  const addStat = () => setStats((prev) => [...prev, { value: "", label: "" }]);
  const removeStat = (index: number) =>
    setStats((prev) => prev.filter((_, i) => i !== index));
  const updateStat = (index: number, field: "value" | "label", val: string) =>
    setStats((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const statsFiltered = stats.filter((s) => s.value.trim() || s.label.trim());
      const payload = {
        badge_text: formData.badge_text || null,
        title: formData.title,
        subtitle: formData.subtitle || null,
        cta_text: formData.cta_text || null,
        cta_url: formData.cta_url || "#contact",
        details_text: formData.details_text || null,
        details_url: formData.details_url || null,
        is_active: formData.is_active,
        display_order: parseInt(formData.display_order) || 0,
        stats: statsFiltered,
      };

      if (initialData?.id) {
        const { error: updateError } = await (supabase.from("discount_section") as any)
          .update(payload)
          .eq("id", initialData.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await (supabase.from("discount_section") as any).insert(
          payload
        );
        if (insertError) throw insertError;
      }

      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Rozet metni</label>
        <input
          type="text"
          value={formData.badge_text}
          onChange={(e) =>
            setFormData({ ...formData, badge_text: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="Özel Kampanya"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ana başlık *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="İlk Randevunuzda %30 İndirim"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Alt metin</label>
        <input
          type="text"
          value={formData.subtitle}
          onChange={(e) =>
            setFormData({ ...formData, subtitle: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="Yeni müşterilerimize özel! ..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Buton metni</label>
          <input
            type="text"
            value={formData.cta_text}
            onChange={(e) =>
              setFormData({ ...formData, cta_text: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Hemen Randevu Al"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Buton linki</label>
          <input
            type="text"
            value={formData.cta_url}
            onChange={(e) =>
              setFormData({ ...formData, cta_url: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="#contact"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detay link metni
          </label>
          <input
            type="text"
            value={formData.details_text}
            onChange={(e) =>
              setFormData({ ...formData, details_text: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Kampanya Detayları"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detay link URL
          </label>
          <input
            type="text"
            value={formData.details_url}
            onChange={(e) =>
              setFormData({ ...formData, details_url: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="#pricing veya boş bırakın"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">İstatistikler</label>
          <button
            type="button"
            onClick={addStat}
            className="text-sm font-medium text-pink-600 hover:text-pink-700"
          >
            + İstatistik Ekle
          </button>
        </div>
        <div className="space-y-2">
          {stats.map((stat, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={stat.value}
                onChange={(e) => updateStat(index, "value", e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                placeholder="500+"
              />
              <input
                type="text"
                value={stat.label}
                onChange={(e) => updateStat(index, "label", e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                placeholder="Mutlu Müşteri"
              />
              <button
                type="button"
                onClick={() => removeStat(index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) =>
            setFormData({ ...formData, is_active: e.target.checked })
          }
          className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
          Kampanya alanını ana sayfada göster
        </label>
      </div>

      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : initialData ? "Güncelle" : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
