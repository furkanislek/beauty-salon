# Beauty Salon — Lüks Güzellik ve Spa Merkezi

Profesyonel güzellik salonu ve spa merkezi için geliştirilmiş, tam özellikli bir web uygulaması. Müşteri tarafında tanıtım, blog ve randevu alma; yönetim tarafında içerik ve randevu yönetimi sunar.

---

## İçindekiler

- [Teknoloji Yığını](#teknik-yığın)
- [Mimari Genel Bakış](#mimari-genel-bakış)
- [Proje Yapısı](#proje-yapısı)
- [Veritabanı ve Tipler](#veritabanı-ve-tipler)
- [Ortak Sayfalar (Public)](#ortak-sayfalar-public)
- [Admin Paneli](#admin-paneli)
- [Kimlik Doğrulama ve Proxy](#kimlik-doğrulama-ve-proxy)
- [Supabase İstemcileri](#supabase-istemcileri)
- [Kurulum ve Çalıştırma](#kurulum-ve-çalıştırma)
- [Ortam Değişkenleri](#ortam-değişkenleri)

---

## Teknik Yığın

| Katman | Teknoloji |
|--------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19 |
| **Stil** | Tailwind CSS 4 |
| **Backend / Auth / DB** | Supabase (PostgreSQL, Auth) |
| **Dil** | TypeScript 5 |
| **Zengin Metin** | TipTap (React, Starter Kit) |

- **Fontlar:** Playfair Display (başlıklar), Inter (gövde metni)
- **Görsel:** Next.js `Image` ile optimize edilmiş görseller; `next.config.ts` içinde Unsplash için `remotePatterns` tanımlı

---

## Mimari Genel Bakış

Uygulama tek repo içinde iki ana bölümden oluşur:

1. **Public (Müşteri tarafı)**  
   Ana sayfa, blog ve randevu formu. Sunucu bileşenleri ve Supabase ile veri çekimi; sayfa bazlı cache (`revalidate`).

2. **Admin (Yönetim paneli)**  
   `/admin` altında toplanan sayfalar. Supabase Auth ile korunur; proxy ile giriş yapmamış kullanıcılar `/admin/login`e yönlendirilir.

Veri akışı:

- **Public:** `createClient()` (server veya client) → Supabase REST API → PostgreSQL.
- **Admin:** Aynı client’lar; hassas işlemler için ileride `createAdminClient()` (service role) kullanılabilir.
- **Auth:** Cookie tabanlı oturum; proxy her `/admin/*` isteğinde oturumu kontrol eder.

---

## Proje Yapısı

```
beauty-salon/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Kök layout (metadata, fontlar)
│   ├── page.tsx                  # Ana sayfa (tüm bölümler)
│   ├── globals.css
│   ├── admin/                    # Yönetim paneli
│   │   ├── login/page.tsx        # Giriş
│   │   ├── dashboard/page.tsx    # Dashboard (bölüm linkleri)
│   │   ├── hero/                 # Hero bölümü CRUD
│   │   ├── treatments/           # Tedavi bölümü + programlar
│   │   ├── pricing/              # Fiyat paketleri (liste, yeni, düzenle)
│   │   ├── discount/             # Kampanya / indirim alanı
│   │   ├── blog/                 # Blog listesi, yeni, düzenle
│   │   ├── appointments/         # Randevu listesi ve durum güncelleme
│   │   └── settings/             # İletişim ayarları
│   └── blog/                     # Public blog
│       ├── layout.tsx
│       ├── page.tsx              # Blog listesi
│       └── [slug]/page.tsx       # Yazı detay
├── components/
│   ├── shared/                   # Header, Footer, Button
│   ├── home/                     # Ana sayfa bölümleri
│   │   ├── HeroSection.tsx
│   │   ├── TreatmentSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── DiscountSection.tsx
│   │   ├── TestimonialSection.tsx
│   │   ├── BlogSection.tsx
│   │   └── AppointmentSection.tsx
│   └── admin/                    # AdminNav, DeleteButton, NoteModalButton, RichTextEditor
├── lib/supabase/
│   ├── server.ts                 # Sunucu Supabase client (cookies)
│   ├── client.ts                 # Tarayıcı Supabase client
│   └── admin.ts                  # Service role client (admin işlemleri)
├── types/
│   ├── database.ts               # Supabase tabloları ve RPC tipleri
│   └── blog.ts                   # Blog ile ilgili ek tipler / sabitler
├── proxy.ts                      # /admin koruması ve auth yönlendirme (Next.js 16 proxy)
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Veritabanı ve Tipler

Tüm tablolar ve RPC’ler `types/database.ts` içinde TypeScript olarak tanımlıdır. Özet:

### İçerik ve Sayfa Bölümleri

- **hero_section** — Ana sayfa üst alanı (başlık, alt başlık, CTA, istatistikler, görsel).
- **treatment_section** — “Neden bizi seçmelisiniz” metni, görsel, benefits.
- **treatment_programs** — Tedavi/hizmet kartları (ikon, ad, açıklama, link).
- **discount_section** — Kampanya alanı (badge, başlık, CTA, istatistikler).
- **contact_settings** — İletişim başlığı, telefon, e-posta, adres, çalışma saatleri (randevu bölümünde kullanılır).

### Hizmet ve Fiyat

- **services** — Hizmetler (başlık, slug, açıklama, fiyat, süre, kategori, sıra, ana sayfada öne çıkan vb.).
- **pricing_packages** — Fiyat paketleri (ad, açıklama, fiyat, birim, özellik listesi, popüler işareti, sıra).

### Blog ve İçerik

- **blog_posts** — Slug, başlık, özet, içerik (zengin metin), görsel, kategori, yazar, okuma süresi, yayın tarihi, görüntülenme, meta alanları.

### Randevu ve İletişim

- **appointments** — Müşteri adı, telefon, e-posta, hizmet, tarih, saat, not, durum (pending, confirmed, completed, cancelled, no_show), iptal nedeni, hatırlatma.
- **working_hours** — Günlük çalışma saatleri, randevu aralığı, slot kapasitesi.
- **contact_messages** — İletişim formu mesajları (okundu, yanıt tarihi vb.).

### Diğer

- **testimonials** — Müşteri yorumu, avatar, puan, hizmet, öne çıkan, sıra.
- **settings** — Genel ayarlar (key-value, tip, public/private).
- **gallery** — Galeri görselleri (opsiyonel kullanım).

### RPC Fonksiyonları

- **get_available_slots(p_date)** — Belirli bir tarih için uygun randevu saatlerini döner.
- **is_appointment_slot_available(p_date, p_time, p_duration_minutes)** — Slot müsaitlik kontrolü.

Bu fonksiyonlar randevu formunda (özellikle `AppointmentSection`) müsait saatleri göstermek ve çakışmayı önlemek için kullanılır.

---

## Ortak Sayfalar (Public)

### Ana Sayfa (`/`)

- **Layout:** `Header` + `main` (bölümler) + `Footer`.
- **Cache:** `revalidate = 3600` (1 saat).
- **Bölümler (sırayla):**
  1. **HeroSection** — hero_section verisi.
  2. **TreatmentSection** — treatment_section + treatment_programs.
  3. **ServicesSection** — services (özellikle ana sayfada gösterilenler).
  4. **PricingSection** — pricing_packages.
  5. **DiscountSection** — discount_section.
  6. **TestimonialSection** — testimonials.
  7. **BlogSection** — Son blog yazıları (blog_posts).
  8. **AppointmentSection** — Randevu formu + contact_settings, services, müsait saatler (RPC).

`AppointmentSection` client component’tir; form gönderimi ve slot çekimi tarayıcıdan Supabase’e yapılır. Query parametresi ile `?service=...` ile ön seçili hizmet desteklenir.

### Blog

- **`/blog`** — Tüm aktif blog yazıları, kategori filtreleme (UI), Supabase’den listeleme.
- **`/blog/[slug]`** — Tekil yazı; slug ile `blog_posts`’tan çekilir. Metadata ve görsel `next/image` ile kullanılır.

Public sayfalar sunucu bileşenleri ağırlıklı; sadece form ve etkileşimli kısımlar client component’tir.

---

## Admin Paneli

Tüm admin sayfaları `/admin` altındadır ve proxy ile korunur.

### Giriş

- **`/admin/login`** — E-posta/şifre ile Supabase `signInWithPassword`. Başarılı girişte `/admin/dashboard`’a yönlendirme. Zaten giriş yapmış kullanıcı bu sayfaya gelirse yine dashboard’a yönlendirilir.

### Dashboard

- **`/admin/dashboard`** — Bölümlere kısayol kartları:
  - Ana sayfa: Hero, Tedavi/Hizmetler, Fiyatlandırma, Kampanya.
  - İçerik: Blog.
  - Yönetim: Randevular.

### Bölüm Yönetimi

- **Hero** (`/admin/hero`) — Hero alanı formu (HeroForm); tek kayıt güncelleme.
- **Tedaviler** (`/admin/treatments`) — Treatment section formu + program listesi. Programlar için `/admin/treatments/programs/new` ve `/admin/treatments/programs/[id]/edit`.
- **Fiyatlandırma** (`/admin/pricing`) — Paket listesi, yeni paket, düzenleme (`/admin/pricing/new`, `/admin/pricing/[id]/edit`).
- **Kampanya** (`/admin/discount`) — Discount section formu (DiscountForm).
- **Ayarlar** (`/admin/settings`) — İletişim ayarları (ContactSettingsForm); randevu bölümündeki iletişim bilgileri.

### Blog Yönetimi

- **`/admin/blog`** — Yazı listesi.
- **`/admin/blog/new`** — Yeni yazı (RichTextEditor ile içerik).
- **`/admin/blog/[id]/edit`** — Yazı düzenleme.

### Randevu Yönetimi

- **`/admin/appointments`** — Randevu listesi (tablo). Durum güncelleme (pending, confirmed, completed, cancelled, no_show), not ekleme (NoteModalButton), silme (DeleteButton) gibi işlemler.

Admin arayüzünde ortak bileşenler: **AdminNav** (üst menü ve çıkış), **DeleteButton**, **NoteModalButton**, **RichTextEditor** (TipTap).

---

## Kimlik Doğrulama ve Proxy

- **proxy.ts** sadece `/admin/*` path’lerinde çalışır (`matcher: ['/admin/:path*']`).
- Her istekte Supabase server client ile cookie’den `getUser()` çağrılır.
- Kurallar:
  - Kullanıcı yok ve path `/admin` veya altı (login hariç) → yönlendirme `/admin/login`.
  - Kullanıcı var ve path tam olarak `/admin/login` → yönlendirme `/admin/dashboard`.
- Auth state cookie’ler üzerinden taşındığı için `setAll` ile response’a da yazılır; böylece sonraki sayfa ve API istekleri oturumu görür.

---

## Supabase İstemcileri

- **`lib/supabase/server.ts`** — `createClient()`: Sunucu bileşenleri ve Server Actions için. Cookie okur/yazar; anon key kullanır.
- **`lib/supabase/client.ts`** — `createClient()`: Client component’ler için (tarayıcı). Anon key.
- **`lib/supabase/admin.ts`** — `createAdminClient()`: Service role key ile; RLS bypass, hassas admin işlemleri için. Şu an randevu güncelleme vb. yerlerde gerekirse kullanılabilir.

Tüm client’lar `types/database.ts` ile tip güvenli kullanılacak şekilde tanımlanmıştır.

---

## Kurulum ve Çalıştırma

### Gereksinimler

- Node.js 20+
- npm veya benzeri paket yöneticisi
- Supabase projesi (URL, anon key, giriş için kullanıcı; opsiyonel: service role key)

### Adımlar

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusu (http://localhost:3000)
npm run dev

# Production build
npm run build

# Production sunucusu
npm start
```

Lint:

```bash
npm run lint
```

---

## Ortam Değişkenleri

`.env.local` (veya proje ortamına uygun dosya) içinde tanımlanmalı:

| Değişken | Açıklama |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL’i |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | (Opsiyonel) Admin/service role key; hassas işlemler için |

Admin girişi için Supabase Dashboard üzerinden Auth → Users ile bir kullanıcı oluşturulmalı; bu e-posta/şifre ile `/admin/login` kullanılır.

---

## Özet

- **Mimari:** Next.js App Router + Supabase (PostgreSQL + Auth), tip güvenli TypeScript.
- **Public:** Ana sayfa (Hero’dan Randevu’ya kadar bölümler), blog listesi/detay, randevu formu ve müsait slotlar.
- **Admin:** Giriş, dashboard, hero/tedavi/fiyat/kampanya/iletişim ayarları, blog CRUD, randevu listesi ve durum yönetimi.
- **Güvenlik:** Admin rotaları proxy ile korunur; auth cookie tabanlıdır.

Bu README, projenin mimarisini ve işlevlerini detaylı şekilde açıklar. Veritabanı şeması (tablo ve RPC’ler) Supabase tarafında `types/database.ts` ile uyumlu olacak şekilde kurulmalıdır.
