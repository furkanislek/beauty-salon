"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import type { HeroSection, HeroSectionStat } from "@/types/database";

export default function HeroForm({
  initialData,
}: {
  initialData: HeroSection | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    badge_text: "Lüks Güzellik Deneyimi",
    title_line1: "Güzelliğinizi",
    title_line2: "Keşfedin",
    subtitle:
      "Profesyonel ekibimiz ve son teknoloji ekipmanlarımızla size özel güzellik ve spa hizmetleri sunuyoruz.",
    cta_primary_text: "Randevu Al",
    cta_primary_url: "#contact",
    cta_secondary_text: "Hizmetlerimiz",
    cta_secondary_url: "#services",
    image_url: "",
    image_alt: "Beauty Salon",
    card_title: "%100 Doğal Ürünler",
    card_subtitle: "Sertifikalı ve organik",
    is_active: true,
    display_order: "0",
  });
  const [stats, setStats] = useState<HeroSectionStat[]>([
    { value: "500+", label: "Mutlu Müşteri" },
    { value: "15+", label: "Yıllık Deneyim" },
    { value: "50+", label: "Hizmet Çeşidi" },
  ]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        badge_text: initialData.badge_text ?? "Lüks Güzellik Deneyimi",
        title_line1: initialData.title_line1,
        title_line2: initialData.title_line2,
        subtitle: initialData.subtitle ?? "",
        cta_primary_text: initialData.cta_primary_text ?? "Randevu Al",
        cta_primary_url: initialData.cta_primary_url ?? "#contact",
        cta_secondary_text: initialData.cta_secondary_text ?? "Hizmetlerimiz",
        cta_secondary_url: initialData.cta_secondary_url ?? "#services",
        image_url: initialData.image_url ?? "",
        image_alt: initialData.image_alt ?? "Beauty Salon",
        card_title: initialData.card_title ?? "%100 Doğal Ürünler",
        card_subtitle: initialData.card_subtitle ?? "Sertifikalı ve organik",
        is_active: initialData.is_active,
        display_order: String(initialData.display_order),
      });
      if (initialData.image_url) {
        setImagePreview(initialData.image_url);
      }
      const s = initialData.stats;
      setStats(
        Array.isArray(s) && s.length > 0
          ? s.map((x) => ({ value: x?.value ?? "", label: x?.label ?? "" }))
          : [{ value: "", label: "" }],
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageUrl = formData.image_url?.trim() || null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `hero/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("gallery").getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      const statsFiltered = stats.filter(
        (s) => s.value.trim() || s.label.trim(),
      );
      const payload = {
        badge_text: formData.badge_text || null,
        title_line1: formData.title_line1,
        title_line2: formData.title_line2,
        subtitle: formData.subtitle || null,
        cta_primary_text: formData.cta_primary_text || null,
        cta_primary_url: formData.cta_primary_url || "#contact",
        cta_secondary_text: formData.cta_secondary_text || null,
        cta_secondary_url: formData.cta_secondary_url || "#services",
        stats: statsFiltered,
        image_url: imageUrl,
        image_alt: formData.image_alt || null,
        card_title: formData.card_title || null,
        card_subtitle: formData.card_subtitle || null,
        is_active: formData.is_active,
        display_order: parseInt(formData.display_order) || 0,
      };

      if (initialData?.id) {
        const { error: updateError } = await (
          supabase.from("hero_section") as any
        )
          .update(payload)
          .eq("id", initialData.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await (
          supabase.from("hero_section") as any
        ).insert(payload);
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rozet / Üst etiket
        </label>
        <input
          type="text"
          value={formData.badge_text}
          onChange={(e) =>
            setFormData({ ...formData, badge_text: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="Lüks Güzellik Deneyimi"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Başlık satır 1 *
          </label>
          <input
            type="text"
            required
            value={formData.title_line1}
            onChange={(e) =>
              setFormData({ ...formData, title_line1: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Güzelliğinizi"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Başlık satır 2 (gradient) *
          </label>
          <input
            type="text"
            required
            value={formData.title_line2}
            onChange={(e) =>
              setFormData({ ...formData, title_line2: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Keşfedin"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alt metin
        </label>
        <textarea
          rows={3}
          value={formData.subtitle}
          onChange={(e) =>
            setFormData({ ...formData, subtitle: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="Profesyonel ekibimiz..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Birincil buton metni
          </label>
          <input
            type="text"
            value={formData.cta_primary_text}
            onChange={(e) =>
              setFormData({ ...formData, cta_primary_text: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Randevu Al"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Birincil buton linki
          </label>
          <input
            type="text"
            value={formData.cta_primary_url}
            onChange={(e) =>
              setFormData({ ...formData, cta_primary_url: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="#contact"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İkincil buton metni
          </label>
          <input
            type="text"
            value={formData.cta_secondary_text}
            onChange={(e) =>
              setFormData({ ...formData, cta_secondary_text: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Hizmetlerimiz"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İkincil buton linki
          </label>
          <input
            type="text"
            value={formData.cta_secondary_url}
            onChange={(e) =>
              setFormData({ ...formData, cta_secondary_url: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="#services"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hero görseli
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Yeni dosya yükleyin veya aşağıya görsel URL yapıştırın (Galeri bucket
          veya harici URL kullanılır)
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent mb-2"
        />
        <input
          type="url"
          value={formData.image_url}
          onChange={(e) => {
            setFormData({ ...formData, image_url: e.target.value });
            if (!imageFile) setImagePreview(e.target.value);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="https://... veya boş bırakın (varsayılan /1.jpg kullanılır)"
        />
        {(imagePreview || formData.image_url) && (
          <div className="mt-4 relative w-48 aspect-[4/5] rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={imagePreview || formData.image_url}
              alt="Önizleme"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Görsel alt metni
        </label>
        <input
          type="text"
          value={formData.image_alt}
          onChange={(e) =>
            setFormData({ ...formData, image_alt: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="Beauty Salon"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kart başlığı (görsel üzerindeki kutu)
          </label>
          <input
            type="text"
            value={formData.card_title}
            onChange={(e) =>
              setFormData({ ...formData, card_title: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="%100 Doğal Ürünler"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kart alt metni
          </label>
          <input
            type="text"
            value={formData.card_subtitle}
            onChange={(e) =>
              setFormData({ ...formData, card_subtitle: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Sertifikalı ve organik"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            İstatistikler (başlık altındaki sayılar)
          </label>
          <button
            type="button"
            onClick={addStat}
            className="text-sm font-medium text-pink-600 hover:text-pink-700"
          >
            + Ekle
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
          id="hero_is_active"
          checked={formData.is_active}
          onChange={(e) =>
            setFormData({ ...formData, is_active: e.target.checked })
          }
          className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
        />
        <label
          htmlFor="hero_is_active"
          className="text-sm font-medium text-gray-700"
        >
          Hero alanını ana sayfada göster
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
