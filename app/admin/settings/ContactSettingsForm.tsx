"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ContactSettings } from "@/types/database";

const DEFAULT_TITLE = "Güzellik Yolculuğunuza Başlayın";
const DEFAULT_DESCRIPTION =
  "Size özel bir randevu oluşturalım. Formu doldurun, en kısa sürede sizinle iletişime geçelim.";

export default function ContactSettingsForm({
  initialData,
}: {
  initialData: ContactSettings | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    contact_title: DEFAULT_TITLE,
    contact_description: DEFAULT_DESCRIPTION,
    phone_numbers: "+90 (212) 555 0123\n+90 (212) 555 0124",
    email_addresses: "info@beautysalon.com\nrandevu@beautysalon.com",
    address: "Nişantaşı Mahallesi, Güzellik Sokak No:123 Şişli / İstanbul",
    working_hours_weekdays: "Pazartesi - Cumartesi: 09:00 - 20:00",
    working_hours_sunday: "Pazar: 10:00 - 18:00",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        contact_title: initialData.contact_title || DEFAULT_TITLE,
        contact_description: initialData.contact_description ?? DEFAULT_DESCRIPTION,
        phone_numbers: initialData.phone_numbers ?? "",
        email_addresses: initialData.email_addresses ?? "",
        address: initialData.address ?? "",
        working_hours_weekdays: initialData.working_hours_weekdays ?? "",
        working_hours_sunday: initialData.working_hours_sunday ?? "",
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        contact_title: formData.contact_title.trim() || DEFAULT_TITLE,
        contact_description: formData.contact_description.trim() || null,
        phone_numbers: formData.phone_numbers.trim() || null,
        email_addresses: formData.email_addresses.trim() || null,
        address: formData.address.trim() || null,
        working_hours_weekdays: formData.working_hours_weekdays.trim() || null,
        working_hours_sunday: formData.working_hours_sunday.trim() || null,
      };

      if (initialData?.id) {
        const { error: updateError } = await (supabase
          .from("contact_settings") as any)
          .update(payload)
          .eq("id", initialData.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await (supabase
          .from("contact_settings") as any)
          .insert({ ...payload, display_order: 0 });
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Başlık *
        </label>
        <input
          type="text"
          required
          value={formData.contact_title}
          onChange={(e) =>
            setFormData({ ...formData, contact_title: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="Güzellik Yolculuğunuza Başlayın"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Açıklama metni
        </label>
        <textarea
          value={formData.contact_description}
          onChange={(e) =>
            setFormData({ ...formData, contact_description: e.target.value })
          }
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="Size özel bir randevu oluşturalım..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Telefon numaraları (satır başına bir numara)
        </label>
        <textarea
          value={formData.phone_numbers}
          onChange={(e) =>
            setFormData({ ...formData, phone_numbers: e.target.value })
          }
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm"
          placeholder="+90 (212) 555 0123"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          E-posta adresleri (satır başına bir adres)
        </label>
        <textarea
          value={formData.email_addresses}
          onChange={(e) =>
            setFormData({ ...formData, email_addresses: e.target.value })
          }
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm"
          placeholder="info@beautysalon.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Adres
        </label>
        <textarea
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="Nişantaşı Mahallesi, Güzellik Sokak No:123 Şişli / İstanbul"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Çalışma saatleri (hafta içi)
          </label>
          <input
            type="text"
            value={formData.working_hours_weekdays}
            onChange={(e) =>
              setFormData({
                ...formData,
                working_hours_weekdays: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Pazartesi - Cumartesi: 09:00 - 20:00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Çalışma saatleri (Pazar)
          </label>
          <input
            type="text"
            value={formData.working_hours_sunday}
            onChange={(e) =>
              setFormData({ ...formData, working_hours_sunday: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Pazar: 10:00 - 18:00"
          />
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t">
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
