export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
  };
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'kis-aylarinda-cilt-bakimi-ipuclari',
    title: 'Kış Aylarında Cilt Bakımı İpuçları',
    excerpt: 'Soğuk havalarda cildinizi nasıl koruyabilirsiniz? Uzman önerilerimizi okuyun.',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop',
    category: 'Cilt Bakımı',
    date: '15 Ocak 2024',
    readTime: '5 dk',
    author: {
      name: 'Dr. Ayşe Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    content: `
# Kış Aylarında Cilt Bakımı İpuçları

Kış ayları geldiğinde, cildiniz ekstra bakıma ihtiyaç duyar. Soğuk hava, rüzgar ve kapalı ortamlardaki kuru hava cildinizi kurutabilir ve tahriş edebilir. İşte kış aylarında cildinizi sağlıklı tutmanız için uzman önerilerimiz:

## 1. Nemlendirme Çok Önemli

Kış aylarında cildinizin nem dengesini korumak için düzenli nemlendirme şarttır. Yüzünüzü yıkadıktan sonra hemen nemlendirici uygulayın. Cildiniz hala nemli iken nemlendirici uygulamak, nemin içeride kalmasına yardımcı olur.

### Nemlendirici Seçimi
- Kuru ciltler için yağlı bazlı nemlendiriciler
- Karma ciltler için jel bazlı nemlendiriciler
- Hassas ciltler için parfümsüz ürünler

## 2. Sıcak Duş Yerine Ilık Su

Sıcak su cildinizin doğal yağlarını alır ve kurumasına neden olur. Ilık su ile duş almayı tercih edin ve duş sürenizi 10 dakika ile sınırlayın.

## 3. Güneş Koruyucu Kullanmayı Unutmayın

Kış aylarında bile güneş ışınları cildinize zarar verebilir. Özellikle kar yansıması UV ışınlarını artırır. Her gün en az SPF 30 içeren bir güneş koruyucu kullanın.

## 4. İç Ortam Nemlendiricisi

Kalorifer ve ısıtma sistemleri havayı kurutur. Yatak odanızda bir hava nemlendirici kullanarak cildinizin gece boyunca nem kaybetmesini önleyin.

## 5. Bol Su İçin

Cildinizi içeriden nemlendirebilmek için günde en az 8 bardak su için. Yeşil çay ve bitki çayları da iyi alternatiflerdir.

## 6. Peeling Yapmayı Unutmayın

Haftada 1-2 kez hafif bir peeling yaparak ölü deri hücrelerini temizleyin. Bu, nemlendiricinizin daha iyi emilmesine yardımcı olur.

## Profesyonel Destek

Cilt sorunlarınız devam ediyorsa, profesyonel bir cilt bakımı uzmanına danışmanızı öneririz. Salonumuzda kış aylarına özel cilt bakım programları sunuyoruz.

**Randevu almak için bizi arayın!**
    `,
  },
  {
    slug: 'masajin-sagliga-faydalari',
    title: 'Masajın Sağlığa Faydaları',
    excerpt: 'Düzenli masajın vücudunuza ve ruh sağlığınıza olan etkileri hakkında bilmeniz gerekenler.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop',
    category: 'Spa & Wellness',
    date: '12 Ocak 2024',
    readTime: '7 dk',
    author: {
      name: 'Zeynep Kaya',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    content: `
# Masajın Sağlığa Faydaları

Masaj, binlerce yıldır insanların fiziksel ve zihinsel sağlığını iyileştirmek için kullanılan doğal bir tedavi yöntemidir. Modern bilim, masajın sayısız faydasını kanıtlamıştır.

## Fiziksel Faydalar

### 1. Kas Gerginliğini Azaltır
Düzenli masaj, kaslarınızdaki gerginliği azaltır ve esnekliği artırır. Özellikle masa başı çalışanlar için boyun ve sırt masajı çok faydalıdır.

### 2. Kan Dolaşımını İyileştirir
Masaj, kan dolaşımını hızlandırarak vücudunuzun her yerine oksijen ve besin taşınmasını kolaylaştırır.

### 3. Ağrıyı Azaltır
Kronik ağrılar, migren ve fibromiyalji gibi durumlar için masaj etkili bir tedavi yöntemidir.

## Zihinsel Faydalar

### Stres Azaltma
Masaj, kortizol seviyesini düşürerek stresi azaltır ve rahatlamanızı sağlar.

### Uyku Kalitesini Artırır
Düzenli masaj, uyku hormonlarını dengeleyerek daha kaliteli uyumanıza yardımcı olur.

### Ruh Halini İyileştirir
Masaj sırasında salgılanan endorfinler, mutluluk hissinizi artırır ve depresyon belirtilerini azaltır.

## Masaj Çeşitleri

1. **İsveç Masajı**: Rahatlatıcı ve yumuşak hareketler
2. **Derin Doku Masajı**: Kronik kas gerginliği için
3. **Aromaterapi Masajı**: Uçucu yağlarla yapılan rahatlatıcı masaj
4. **Taş Masajı**: Sıcak taşlarla yapılan terapi
5. **Refleksoloji**: Ayak masajı ile tüm vücudu etkiler

## Ne Sıklıkla Masaj Yaptırmalısınız?

Genel sağlık için ayda 1-2 kez masaj yeterlidir. Ancak kronik ağrı veya yüksek stres yaşıyorsanız, haftada bir masaj daha faydalı olabilir.

## Salonumuzda Sunduğumuz Masaj Hizmetleri

Profesyonel terapistlerimiz, size özel masaj programları hazırlar. Rahatlatıcı ortamımızda kendinizi şımartın!
    `,
  },
  {
    slug: 'sac-bakiminda-dogal-yontemler',
    title: 'Saç Bakımında Doğal Yöntemler',
    excerpt: 'Kimyasal ürünler yerine doğal yöntemlerle sağlıklı saçlara kavuşun.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop',
    category: 'Saç Bakımı',
    date: '10 Ocak 2024',
    readTime: '6 dk',
    author: {
      name: 'Mehmet Demir',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    content: `
# Saç Bakımında Doğal Yöntemler

Sağlıklı ve parlak saçlar için kimyasal ürünlere ihtiyacınız yok! Doğal yöntemlerle saçlarınızı besleyebilir ve güçlendirebilirsiniz.

## Doğal Saç Maskeleri

### 1. Zeytinyağı Maskesi
**Malzemeler:**
- 2 yemek kaşığı zeytinyağı
- 1 yemek kaşığı bal

**Uygulama:**
Karışımı saç diplerinize ve uçlarınıza sürün. 30 dakika bekletin ve ılık suyla durulayın.

### 2. Avokado Maskesi
**Malzemeler:**
- 1 olgun avokado
- 1 yemek kaşığı hindistancevizi yağı

**Uygulama:**
Avokadonun püresini çıkarın ve hindistancevizi yağı ile karıştırın. Saçınıza uygulayın ve 20 dakika bekleyin.

### 3. Yumurta Maskesi
**Malzemeler:**
- 1 yumurta
- 1 çay kaşığı limon suyu

**Uygulama:**
Yumurtayı çırpın ve limon suyunu ekleyin. Saçınıza uygulayın ve 15 dakika bekleyin.

## Doğal Saç Durulama Suları

### Elma Sirkesi Durulaması
1 bardak suya 2 yemek kaşığı elma sirkesi ekleyin. Şampuandan sonra saçınızı bu karışımla durulayın. Saçlarınız parlak ve yumuşak olacak.

### Papatya Çayı Durulaması
Sarı saçlar için harika! Demlenmiş papatya çayı ile saçınızı durulayın.

## Saç Bakım İpuçları

1. **Sık Sık Yıkamayın**: Haftada 2-3 kez yeterli
2. **Sıcak Su Kullanmayın**: Ilık veya soğuk su tercih edin
3. **Doğal Kurutma**: Fön yerine havada kurutmayı tercih edin
4. **Düzenli Uç Kesimi**: 6-8 haftada bir uç kestirin
5. **Sağlıklı Beslenin**: Protein, omega-3 ve vitaminler önemli

## Kaçınılması Gerekenler

- Aşırı ısı (fön, maşa, düzleştirici)
- Sıkı topuz ve at kuyruğu
- Klor ve tuzlu su
- Aşırı kimyasal işlemler
- Stres

## Profesyonel Destek

Doğal yöntemler harika olsa da, profesyonel saç bakımı da önemlidir. Salonumuzda organik ürünlerle saç bakımı hizmetleri sunuyoruz.

**Randevu için bizi arayın!**
    `,
  },
];
