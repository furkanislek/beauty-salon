import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import DeleteButton from "@/components/admin/DeleteButton";
import Link from "next/link";
import Image from "next/image";

export default async function AdminBlogPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  const handleDelete = async (id: string) => {
    "use server";
    const supabase = await createClient();
    await supabase.from("blog_posts").delete().eq("id", id);
    redirect("/admin/blog");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Yazıları</h1>
            <p className="text-gray-600 mt-1">Blog içeriklerinizi yönetin</p>
          </div>
          <Link
            href="/admin/blog/new"
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition"
          >
            + Yeni Yazı Ekle
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts && posts.length > 0 ? (
            posts.map((post:any) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-sm border overflow-hidden"
              >
                {post.image_url && (
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    {post.is_active ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Aktif
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        Pasif
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{post.author_name}</span>
                    <span>{post.read_time}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="flex-1 px-4 py-2 text-center text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                    >
                      Düzenle
                    </Link>
                    <form
                      action={handleDelete.bind(null, post.id)}
                      className="flex-1"
                    >
                      <DeleteButton
                        confirmMessage="Bu yazıyı silmek istediğinizden emin misiniz?"
                        className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                      >
                        Sil
                      </DeleteButton>
                    </form>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-500">
              Henüz blog yazısı eklenmemiş. Yeni yazı eklemek için yukarıdaki
              butona tıklayın.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
