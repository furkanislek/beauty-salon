import { createClient } from "@/lib/supabase/server";
import type { DiscountSection } from "@/types/database";
import Button from "../shared/Button";
import Link from "next/link";

export default async function DiscountSection() {
  const supabase = await createClient();

  const { data: row } = await supabase
    .from("discount_section")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  const discount = row as DiscountSection | null;

  if (!discount) {
    return null;
  }

  const stats = Array.isArray(discount.stats) ? discount.stats : [];
  const ctaUrl = discount.cta_url || "#contact";
  const detailsUrl = discount.details_url?.trim() || "#pricing";

  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {discount.badge_text && (
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <span className="text-sm font-medium">{discount.badge_text}</span>
            </div>
          )}

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {discount.title}
          </h2>

          {discount.subtitle && (
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              {discount.subtitle}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href={ctaUrl}>
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-primary-600 hover:bg-gray-100 border-0"
              >
                {discount.cta_text || "Hemen Randevu Al"}
              </Button>
            </Link>
            {discount.details_text && (
              <>
                <span className="text-primary-100">veya</span>
                <Link
                  href={detailsUrl}
                  className="text-white font-semibold hover:underline"
                >
                  {discount.details_text} →
                </Link>
              </>
            )}
          </div>

          {stats.length > 0 && (
            <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-white/20">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-primary-100 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
