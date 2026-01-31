import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { BlogPost } from "@/types/database";

export const metadata = {
  title: "Blog | Beauty Salon",
  description: "Güzellik ve bakım ipuçları, son trendler ve sağlık önerileri",
};

export const revalidate = 3600; // 1 saat cache

export default async function BlogPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const posts = data as BlogPost[] | null;
  if (!posts) {
    notFound();
  }

  const categories = Array.from(
    new Set(posts.map((post) => post.category).filter(Boolean)),
  );

  return (
    <main className="min-h-screen pt-20">
      <section className="py-16 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-primary-600 font-medium text-sm tracking-wider uppercase">
              Blog & Haberler
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mt-4 mb-6">
              Güzellik ve Sağlık Rehberi
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Uzmanlarımızdan güzellik ve bakım ipuçları, son trendler ve sağlık
              önerileri
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-12">
            <button className="px-6 py-2 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors">
              Tümü
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 bg-white text-gray-700 rounded-full font-medium hover:bg-primary-50 hover:text-primary-600 transition-colors shadow-sm"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative aspect-[3/2] overflow-hidden">
                    {post.image_url ? (
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-200 to-secondary-200" />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {new Date(post.created_at).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      {post.read_time && (
                        <span className="flex items-center gap-1">
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {post.read_time}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-4">{post.excerpt}</p>

                    {post.author_name && (
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-600 font-semibold text-sm">
                            {post.author_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {post.author_name}
                        </span>
                      </div>
                    )}

                    <span className="text-primary-600 font-semibold hover:underline flex items-center gap-2">
                      Devamını Oku
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Güzellik İpuçlarını Kaçırmayın
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            En son blog yazılarımızı ve özel tekliflerimizi e-posta ile alın
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-8 py-4 bg-white text-primary-600 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Abone Ol
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
