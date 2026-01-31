import { createClient } from "@/lib/supabase/server";
import type { PricingPackage } from "@/types/database";

export default async function PricingSection() {
  const supabase = await createClient();

  const { data: packages } = await supabase
    .from("pricing_packages")
    .select("*")
    .order("display_order", { ascending: true });

  const pricingPlans = (packages ?? []) as PricingPackage[];

  if (pricingPlans.length === 0) {
    return null;
  }

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary-600 font-medium text-sm tracking-wider uppercase">
            Fiyatlandırma
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
            Size Uygun Paketi Seçin
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Aylık paketlerimizle düzenli bakım alın, hem tasarruf edin hem de
            her zaman bakımlı kalın
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => {
            const features = Array.isArray(plan.features) ? plan.features : [];
            const priceFormatted = new Intl.NumberFormat("tr-TR", {
              style: "decimal",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(Number(plan.price));
            const popular = plan.is_popular ?? false;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 ${
                  popular
                    ? "bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-2xl scale-105"
                    : "bg-white border-2 border-gray-200 hover:border-primary-300 transition-colors"
                }`}
              >
                {popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary-500 text-white px-6 py-1 rounded-full text-sm font-medium">
                    En Popüler
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3
                    className={`text-2xl font-bold mb-2 ${popular ? "text-white" : "text-gray-900"}`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-sm mb-6 ${popular ? "text-primary-100" : "text-gray-600"}`}
                  >
                    {plan.description ?? ""}
                  </p>
                  <div className="flex items-end justify-center gap-1">
                    <span
                      className={`text-5xl font-bold ${popular ? "text-white" : "text-gray-900"}`}
                    >
                      ₺{priceFormatted}
                    </span>
                    <span
                      className={`text-lg mb-2 ${popular ? "text-primary-100" : "text-gray-600"}`}
                    >
                      {plan.price_unit ?? "/ay"}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className={`w-6 h-6 mr-3 flex-shrink-0 ${popular ? "text-white" : "text-primary-600"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span
                        className={popular ? "text-white" : "text-gray-700"}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`block w-full py-4 rounded-xl font-semibold transition-all duration-300 text-center ${
                    popular
                      ? "bg-white text-primary-600 hover:bg-gray-100"
                      : "bg-primary-600 text-white hover:bg-primary-700"
                  }`}
                >
                  Paketi Seç
                </a>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Tek seferlik hizmet mi almak istiyorsunuz?
          </p>
          <a
            href="#services"
            className="text-primary-600 font-semibold hover:underline inline-block"
          >
            Tüm Hizmet Fiyatlarını Görüntüle →
          </a>
        </div>
      </div>
    </section>
  );
}
