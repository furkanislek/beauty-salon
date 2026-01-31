import { createClient } from "@/lib/supabase/server";
import type { HeroSection as HeroSectionType } from "@/types/database";
import Image from "next/image";
import Button from "../shared/Button";
import Link from "next/link";

export default async function HeroSection() {
  const supabase = await createClient();

  const { data: row } = await supabase
    .from("hero_section")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  const hero = row as HeroSectionType | null;

  if (!hero) {
    return null;
  }

  const stats = Array.isArray(hero.stats) ? hero.stats : [];
  const imageSrc = hero.image_url || "/1.jpg";
  const primaryUrl = hero.cta_primary_url || "#contact";
  const secondaryUrl = hero.cta_secondary_url || "#services";

  return (
    <section className="relative min-h-screen flex items-center pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 -z-10" />

      <div className="container mx-auto px-8 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {hero.badge_text && (
              <div className="inline-block">
                <span className="text-primary-600 font-medium text-sm tracking-wider uppercase">
                  {hero.badge_text}
                </span>
              </div>
            )}

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="block text-gray-900">{hero.title_line1}</span>
              <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {hero.title_line2}
              </span>
            </h1>

            {hero.subtitle && (
              <p className="text-lg md:text-xl text-gray-600 max-w-xl">
                {hero.subtitle}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={primaryUrl}>
                <Button size="lg">
                  {hero.cta_primary_text || "Randevu Al"}
                </Button>
              </Link>
              <Link href={secondaryUrl}>
                <Button size="lg" variant="outline">
                  {hero.cta_secondary_text || "Hizmetlerimiz"}
                </Button>
              </Link>
            </div>

            {stats.length > 0 && (
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={
                      index > 0 ? "border-l border-gray-300 pl-6 sm:pl-8" : ""
                    }
                  >
                    <div className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={imageSrc}
                alt={hero.image_alt || "Beauty Salon"}
                fill
                className="object-cover"
                priority
                unoptimized={imageSrc.startsWith("http")}
              />
            </div>

            {(hero.card_title || hero.card_subtitle) && (
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {hero.card_title}
                    </div>
                    {hero.card_subtitle && (
                      <div className="text-sm text-gray-600">
                        {hero.card_subtitle}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
