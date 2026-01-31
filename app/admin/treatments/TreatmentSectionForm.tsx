"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import type { TreatmentSection as TreatmentSectionType } from "@/types/database";

export default function TreatmentSectionForm({
  initialData,
}: {
  initialData: TreatmentSectionType | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    badge_text: "Hizmetlerimiz",
    title: "Özel Tedavi Programları",
    subtitle:
      "Size özel hazırlanan tedavi programlarımızla güzelliğinizi ve sağlığınızı bir arada koruyun",
    why_title: "Neden Bizi Seçmelisiniz?",
    why_description:
      "15 yılı aşkın deneyimimiz ve uzman kadromuzla size en iyi hizmeti sunuyoruz.",
    why_image_url: "",
    why_image_alt: "Spa Treatment",
    is_active: true,
    display_order: "0",
  });
  const [benefits, setBenefits] = useState<string[]>([""]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        badge_text: initialData.badge_text ?? "Hizmetlerimiz",
        title: initialData.title ?? "Özel Tedavi Programları",
        subtitle: initialData.subtitle ?? "",
        why_title: initialData.why_title ?? "Neden Bizi Seçmelisiniz?",
        why_description: initialData.why_description ?? "",
        why_image_url: initialData.why_image_url ?? "",
        why_image_alt: initialData.why_image_alt ?? "Spa Treatment",
        is_active: initialData.is_active,
        display_order: String(initialData.display_order),
      });
      const b = initialData.benefits;
      setBenefits(Array.isArray(b) && b.length > 0 ? b : [""]);
      if (initialData.why_image_url) setImagePreview(initialData.why_image_url);
    }
  }, [initialData]);

  const addBenefit = () => setBenefits((p) => [...p, ""]);
  const removeBenefit = (i: number) =>
    setBenefits((p) => p.filter((_, j) => j !== i));
  const updateBenefit = (i: number, v: string) =>
    setBenefits((p) => {
      const n = [...p];
      n[i] = v;
      return n;
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
      let imageUrl = formData.why_image_url?.trim() || null;
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `treatment/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const {
          data: { publicUrl },
        } = supabase.storage.from("gallery").getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      const benefitsFiltered = benefits.filter((s) => s.trim() !== "");
      const payload = {
        badge_text: formData.badge_text || null,
        title: formData.title || null,
        subtitle: formData.subtitle || null,
        why_title: formData.why_title || null,
        why_description: formData.why_description || null,
        why_image_url: imageUrl,
        why_image_alt: formData.why_image_alt || null,
        benefits: benefitsFiltered,
        is_active: formData.is_active,
        display_order: parseInt(formData.display_order) || 0,
      };

      if (initialData?.id) {
        const { error: updateError } = await (
          supabase.from("treatment_section") as any
        )
          .update(payload)
          .eq("id", initialData.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await (
          supabase.from("treatment_section") as any
        ).insert(payload);
        if (insertError) throw insertError;
      }
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Üst rozet
          </label>
          <input
            type="text"
            value={formData.badge_text}
            onChange={(e) =>
              setFormData({ ...formData, badge_text: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            placeholder="Hizmetlerimiz"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Başlık (tedavi programları)
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            placeholder="Özel Tedavi Programları"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alt başlık
        </label>
        <input
          type="text"
          value={formData.subtitle}
          onChange={(e) =>
            setFormData({ ...formData, subtitle: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          placeholder="Size özel hazırlanan..."
        />
      </div>

      <hr className="border-gray-200" />
      <h3 className="font-semibold text-gray-900">
        Neden Bizi Seçmelisiniz? (alt bölüm)
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Başlık
        </label>
        <input
          type="text"
          value={formData.why_title}
          onChange={(e) =>
            setFormData({ ...formData, why_title: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          placeholder="Neden Bizi Seçmelisiniz?"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Açıklama metni
        </label>
        <textarea
          rows={2}
          value={formData.why_description}
          onChange={(e) =>
            setFormData({ ...formData, why_description: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          placeholder="15 yılı aşkın deneyimimiz..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Görsel
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
        />
        <input
          type="url"
          value={formData.why_image_url}
          onChange={(e) => {
            setFormData({ ...formData, why_image_url: e.target.value });
            if (!imageFile) setImagePreview(e.target.value);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Görsel URL veya yukarıdan yükleyin"
        />
        {(imagePreview || formData.why_image_url) && (
          <div className="mt-2 relative w-48 aspect-video rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={imagePreview || formData.why_image_url}
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
          Avantaj listesi (maddeler)
        </label>
        <div className="space-y-2">
          {benefits.map((b, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={b}
                onChange={(e) => updateBenefit(i, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                placeholder="Örn: Uzman ve sertifikalı terapistler"
              />
              <button
                type="button"
                onClick={() => removeBenefit(i)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                Sil
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addBenefit}
            className="text-sm font-medium text-pink-600 hover:text-pink-700"
          >
            + Madde Ekle
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="ts_active"
          checked={formData.is_active}
          onChange={(e) =>
            setFormData({ ...formData, is_active: e.target.checked })
          }
          className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
        />
        <label
          htmlFor="ts_active"
          className="text-sm font-medium text-gray-700"
        >
          Bölümü ana sayfada göster
        </label>
      </div>
      <div className="flex justify-end pt-4">
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
