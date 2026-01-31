"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "../shared/Button";
import { useSearchParams } from "next/navigation";
import type { ContactSettings, Database } from "@/types/database";

const DEFAULT_CONTACT: ContactSettings = {
  id: "",
  contact_title: "Güzellik Yolculuğunuza Başlayın",
  contact_description:
    "Size özel bir randevu oluşturalım. Formu doldurun, en kısa sürede sizinle iletişime geçelim.",
  phone_numbers: "+90 (212) 555 0123\n+90 (212) 555 0124",
  email_addresses: "info@beautysalon.com\nrandevu@beautysalon.com",
  address: "Nişantaşı Mahallesi, Güzellik Sokak No:123 Şişli / İstanbul",
  working_hours_weekdays: "Pazartesi - Cumartesi: 09:00 - 20:00",
  working_hours_sunday: "Pazar: 10:00 - 18:00",
  display_order: 0,
  created_at: "",
  updated_at: "",
};

function lines(str: string | null): string[] {
  if (!str || !str.trim()) return [];
  return str.trim().split(/\r?\n/).filter(Boolean);
}

export default function AppointmentSection() {
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [contactSettings, setContactSettings] =
    useState<ContactSettings | null>(null);
  const [services, setServices] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    message: "",
  });

  useEffect(() => {
    const serviceParam = searchParams.get("service");
    if (serviceParam) {
      setFormData((prev) => ({ ...prev, service: serviceParam }));
    }
  }, [searchParams]);

  useEffect(() => {
    const loadContactSettings = async () => {
      const { data } = await supabase
        .from("contact_settings")
        .select("*")
        .order("display_order", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (data) setContactSettings(data as ContactSettings);
    };
    loadContactSettings();
  }, [supabase]);

  useEffect(() => {
    const loadServices = async () => {
      const { data } = await supabase
        .from("services")
        .select("id, title")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (data) {
        setServices(data);
      }
    };

    loadServices();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const selectedService = services.find(
        (s) => s.title === formData.service,
      );

      const payload: Database["public"]["Tables"]["appointments"]["Insert"] = {
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service_id: selectedService?.id || null,
        service_name: formData.service,
        appointment_date: formData.date,
        appointment_time: formData.time,
        notes: formData.message || null,
        status: "pending",
        cancellation_reason: null,
      };
      const appointmentsTable = supabase.from("appointments") as unknown as {
        insert: (v: Database["public"]["Tables"]["appointments"]["Insert"]) => Promise<{ data: unknown; error: { message: string } | null }>;
      };
      const { error: insertError } = await appointmentsTable.insert(payload);

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        date: "",
        time: "",
        message: "",
      });

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary-600 font-medium text-sm tracking-wider uppercase">
                Randevu Al
              </span>
              {(() => {
                const c = contactSettings ?? DEFAULT_CONTACT;
                const phones = lines(c.phone_numbers);
                const emails = lines(c.email_addresses);
                const addressLines = lines(c.address);
                return (
                  <>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
                      {c.contact_title}
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                      {c.contact_description}
                    </p>

                    <div className="space-y-6">
                      {phones.length > 0 && (
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-6 h-6 text-primary-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              Telefon
                            </h3>
                            {phones.map((line, i) => (
                              <p key={i} className="text-gray-600">
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {emails.length > 0 && (
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-6 h-6 text-primary-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              E-posta
                            </h3>
                            {emails.map((line, i) => (
                              <p key={i} className="text-gray-600">
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {(addressLines.length > 0 || c.address?.trim()) && (
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-6 h-6 text-primary-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              Adres
                            </h3>
                            {addressLines.length > 0
                              ? addressLines.map((line, i) => (
                                  <p key={i} className="text-gray-600">
                                    {line}
                                  </p>
                                ))
                              : (
                                  <p className="text-gray-600">
                                    {c.address}
                                  </p>
                                )}
                          </div>
                        </div>
                      )}

                      {(c.working_hours_weekdays || c.working_hours_sunday) && (
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-6 h-6 text-primary-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              Çalışma Saatleri
                            </h3>
                            {c.working_hours_weekdays && (
                              <p className="text-gray-600">
                                {c.working_hours_weekdays}
                              </p>
                            )}
                            {c.working_hours_sunday && (
                              <p className="text-gray-600">
                                {c.working_hours_sunday}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8">
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                  Randevu talebiniz başarıyla gönderildi! En kısa sürede sizinle
                  iletişime geçeceğiz.
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      E-posta *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      placeholder="ornek@email.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      placeholder="0555 555 55 55"
                    />
                  </div>
                </div>

              
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Tarih *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="time"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Saat *
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Mesajınız (Opsiyonel)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Özel bir talebiniz varsa buraya yazabilirsiniz..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Gönderiliyor..." : "Randevu Talebi Gönder"}
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  Randevu talebiniz 24 saat içinde onaylanacaktır.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
