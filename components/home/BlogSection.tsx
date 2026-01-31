import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function BlogSection() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (!posts || posts.length === 0) {
    return null;
  }
  return (
    <section id="blog" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary-600 font-medium text-sm tracking-wider uppercase">
            Blog & Haberler
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
            Güzellik ve Sağlık Rehberi
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Uzmanlarımızdan güzellik ve bakım ipuçları, son trendler ve sağlık
            önerileri
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post : any) => (
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

        <div className="text-center mt-12">
          <Link href="/blog">
            <button className="px-8 py-4 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors font-semibold">
              Tüm Blog Yazılarını Görüntüle
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
