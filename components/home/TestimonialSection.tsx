import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export default async function TestimonialSection() {
  const supabase = await createClient();

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("display_order", { ascending: true })
    .limit(3);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary-600 font-medium text-sm tracking-wider uppercase">
            Müşteri Yorumları
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
            Müşterilerimiz Ne Diyor?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Binlerce mutlu müşterimizin deneyimlerini okuyun
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-3xl shadow-xl p-8"
            >
              <div className="flex items-center gap-4 mb-4">
                {testimonial.customer_avatar ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={testimonial.customer_avatar}
                      alt={testimonial.customer_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-semibold text-xl">
                      {testimonial.customer_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-bold text-gray-900">
                    {testimonial.customer_name}
                  </div>
                  {testimonial.rating && (
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-700 italic">"{testimonial.comment}"</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Kalite Garantisi
            </h3>
            <p className="text-gray-600">
              %100 müşteri memnuniyeti odaklı hizmet
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary-600"
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Esnek Randevu
            </h3>
            <p className="text-gray-600">Size uygun saatlerde randevu imkanı</p>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Uzman Ekip</h3>
            <p className="text-gray-600">
              Sertifikalı ve deneyimli profesyoneller
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
