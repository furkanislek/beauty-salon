import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { TreatmentProgram, TreatmentSection as TreatmentSectionData } from "@/types/database";

function TreatmentIcon({ icon }: { icon: string | null }) {
  const key = (icon || "").trim().toLowerCase();
  if (key === "skin") {
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  if (key === "massage") {
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    );
  }
  if (key === "hair") {
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    );
  }
  if (key === "nail") {
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    );
  }
  return <span className="text-2xl">{icon || "•"}</span>;
}

export default async function TreatmentSection() {
  const supabase = await createClient();

  const [
    { data: programsData },
    { data: sectionRow },
  ] = await Promise.all([
    supabase
      .from("treatment_programs")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
    supabase
      .from("treatment_section")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  const programs = (programsData ?? []) as TreatmentProgram[];
  const section = sectionRow as TreatmentSectionData | null;

  const badge = section?.badge_text ?? "Hizmetlerimiz";
  const title = section?.title ?? "Özel Tedavi Programları";
  const subtitle = section?.subtitle ?? "Size özel hazırlanan tedavi programlarımızla güzelliğinizi ve sağlığınızı bir arada koruyun";
  const whyTitle = section?.why_title ?? "Neden Bizi Seçmelisiniz?";
  const whyDescription = section?.why_description ?? "15 yılı aşkın deneyimimiz ve uzman kadromuzla size en iyi hizmeti sunuyoruz.";
  const whyImageUrl = section?.why_image_url || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop";
  const whyImageAlt = section?.why_image_alt ?? "Spa Treatment";
  const benefits = Array.isArray(section?.benefits) ? section.benefits : [
    "Uzman ve sertifikalı terapistler",
    "Son teknoloji ekipmanlar",
    "%100 doğal ve organik ürünler",
    "Kişiye özel tedavi programları",
    "Hijyen ve güvenlik standartları",
  ];

  const showWhySection = whyTitle || whyDescription || benefits.length > 0 || whyImageUrl;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary-600 font-medium text-sm tracking-wider uppercase">
            {badge}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {programs.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((treatment) => (
              <div
                key={treatment.id}
                className="group relative bg-gradient-to-br from-primary-50 to-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-primary-600 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TreatmentIcon icon={treatment.icon} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {treatment.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {treatment.description || ""}
                </p>
                <Link
                  href={treatment.link_url || "#services"}
                  className="text-primary-600 font-medium text-sm group-hover:underline inline-flex items-center gap-1"
                >
                  Detaylı Bilgi →
                </Link>
              </div>
            ))}
          </div>
        )}

        {showWhySection && (
          <div className="mt-20 grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={whyImageUrl}
                alt={whyImageAlt}
                fill
                className="object-cover"
                unoptimized={whyImageUrl.startsWith("http")}
              />
            </div>

            <div className="space-y-6">
              {whyTitle && (
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {whyTitle}
                </h3>
              )}
              {whyDescription && (
                <p className="text-lg text-gray-600">
                  {whyDescription}
                </p>
              )}

              {benefits.length > 0 && (
                <div className="space-y-4">
                  {benefits.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
