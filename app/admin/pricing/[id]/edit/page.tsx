"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AdminNav from "@/components/admin/AdminNav";
import Link from "next/link";
import type { Database } from "@/types/database";

type PricingPackageRow =
  Database["public"]["Tables"]["pricing_packages"]["Row"];
type PricingUpdate = Database["public"]["Tables"]["pricing_packages"]["Update"];

export default function EditPricingPackagePage() {
  const router = useRouter();
  const supabase = createClient();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    price_unit: "/ay",
    is_popular: false,
    display_order: "0",
  });
  const [features, setFeatures] = useState<string[]>([""]);

  const addFeature = () => setFeatures((prev) => [...prev, ""]);
  const removeFeature = (index: number) =>
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  const updateFeature = (index: number, value: string) =>
    setFeatures((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

  useEffect(() => {
    const loadPackage = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("pricing_packages")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error("Paket bulunamadı");

        const pkg = data as PricingPackageRow;
        const featureList = Array.isArray(pkg.features) ? pkg.features : [];
        setFormData({
          name: pkg.name,
          description: pkg.description || "",
          price: String(pkg.price),
          price_unit: pkg.price_unit || "/ay",
          is_popular: pkg.is_popular,
          display_order: String(pkg.display_order),
        });
        setFeatures(featureList.length > 0 ? featureList : [""]);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Paket yüklenirken bir hata oluştu",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPackage();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const featureList = features.filter((f) => f.trim() !== "");
      const payload: PricingUpdate = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        price_unit: formData.price_unit || "/ay",
        is_popular: formData.is_popular,
        display_order: parseInt(formData.display_order) || 0,
        features: featureList,
      };
      const { error: updateError } = await (
        supabase.from("pricing_packages") as any
      )
        .update(payload)
        .eq("id", id);

      if (updateError) throw updateError;

      router.push("/admin/pricing");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-600">Paket yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/admin/pricing"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            ← Paketlere dön
          </Link>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Paketi Düzenle</h1>
          <p className="text-gray-600 mt-1">{formData.name}</p>
        </div>

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
              Paket Adı *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Örn: Temel Bakım"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Örn: Aylık temel güzellik bakımı paketi"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiyat (₺) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="499"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birim
              </label>
              <input
                type="text"
                value={formData.price_unit}
                onChange={(e) =>
                  setFormData({ ...formData, price_unit: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="/ay"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sıralama
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({ ...formData, display_order: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_popular"
              checked={formData.is_popular}
              onChange={(e) =>
                setFormData({ ...formData, is_popular: e.target.checked })
              }
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label
              htmlFor="is_popular"
              className="text-sm font-medium text-gray-700"
            >
              En Popüler olarak işaretle (kartta vurgulanır)
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Paket Maddeleri (özellikler)
              </label>
              <button
                type="button"
                onClick={addFeature}
                className="text-sm font-medium text-pink-600 hover:text-pink-700"
              >
                + Madde Ekle
              </button>
            </div>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Örn: 1 Yüz Bakımı"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Kaldır"
                  >
                    Sil
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Boş maddeler kaydedilmez. En az bir madde yazın.
            </p>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <Link
              href="/admin/pricing"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
