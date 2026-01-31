import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Service } from "@/types/database";

export default async function ServicesSection() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .eq("featured_on_home", true)
    .order("display_order", { ascending: true })
    .limit(3);

  const services = (data ?? []) as Service[];

  if (services.length === 0) {
    return null;
  }

  return (
    <section
      id="services"
      className="py-20 bg-gradient-to-b from-white to-primary-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary-600 font-medium text-sm tracking-wider uppercase">
            Hizmetlerimiz
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
            Size Özel Güzellik Çözümleri
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ana hizmetlerimizle tanışın; detaylı fiyat ve randevu için bizimle
            iletişime geçin.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {service.image_url ? (
                  <Image
                    src={service.image_url}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-200 to-secondary-200" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <h3 className="absolute bottom-4 left-4 right-4 text-2xl font-bold text-white">
                  {service.title}
                </h3>
              </div>

              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-3">
                  {service.category}
                </span>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {service.short_description ||
                    (typeof service.description === "string"
                      ? service.description
                          .replace(/<[^>]*>/g, "")
                          .slice(0, 150) +
                        (service.description.length > 150 ? "..." : "")
                      : "")}
                </p>
                <Link
                  href={`/#contact?service=${encodeURIComponent(service.title)}`}
                  className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:underline"
                >
                  Randevu Al
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
