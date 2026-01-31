export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string | null;
  price: number | null;
  duration_minutes: number | null;
  category: string;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  featured_on_home: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Gallery {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  category: string | null;
  display_order: number;
  is_active: boolean;
  width: number | null;
  height: number | null;
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  author_name: string;
  author_avatar: string | null;
  read_time: string;
  published_at: string;
  is_active: boolean;
  view_count: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  service_id: string | null;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  cancellation_reason: string | null;
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkingHours {
  id: string;
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  opening_time: string | null;
  closing_time: string | null;
  is_closed: boolean;
  appointment_interval_minutes: number;
  max_appointments_per_slot: number;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string | null;
  type: 'text' | 'number' | 'boolean' | 'json' | 'url' | 'email' | 'phone';
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  replied_at: string | null;
  created_at: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  customer_avatar: string | null;
  rating: number | null;
  comment: string;
  service_id: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  description: string | null;
  price: number;
  price_unit: string | null;
  is_popular: boolean;
  display_order: number;
  features: string[];
  created_at: string;
  updated_at: string;
}

export interface DiscountSectionStat {
  value: string;
  label: string;
}

export interface DiscountSection {
  id: string;
  badge_text: string | null;
  title: string;
  subtitle: string | null;
  cta_text: string | null;
  cta_url: string | null;
  details_text: string | null;
  details_url: string | null;
  is_active: boolean;
  display_order: number;
  stats: DiscountSectionStat[];
  created_at: string;
  updated_at: string;
}

export interface HeroSectionStat {
  value: string;
  label: string;
}

export interface HeroSection {
  id: string;
  badge_text: string | null;
  title_line1: string;
  title_line2: string;
  subtitle: string | null;
  cta_primary_text: string | null;
  cta_primary_url: string | null;
  cta_secondary_text: string | null;
  cta_secondary_url: string | null;
  stats: HeroSectionStat[];
  image_url: string | null;
  image_alt: string | null;
  card_title: string | null;
  card_subtitle: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface TreatmentProgram {
  id: string;
  icon: string | null;
  name: string;
  description: string | null;
  link_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TreatmentSection {
  id: string;
  badge_text: string | null;
  title: string | null;
  subtitle: string | null;
  why_title: string | null;
  why_description: string | null;
  why_image_url: string | null;
  why_image_alt: string | null;
  benefits: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  time_slot: string;
  is_available: boolean;
}

export interface ContactSettings {
  id: string;
  contact_title: string;
  contact_description: string | null;
  phone_numbers: string | null;
  email_addresses: string | null;
  address: string | null;
  working_hours_weekdays: string | null;
  working_hours_sunday: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      services: {
        Row: Service;
        Insert: Omit<Service, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>;
      };
      gallery: {
        Row: Gallery;
        Insert: Omit<Gallery, 'id' | 'created_at'>;
        Update: Partial<Omit<Gallery, 'id' | 'created_at'>>;
      };
      blog_posts: {
        Row: BlogPost;
        Insert: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'view_count'>;
        Update: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>;
      };
      appointments: {
        Row: Appointment;
        Insert: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'reminder_sent'>;
        Update: Partial<Omit<Appointment, 'id' | 'created_at' | 'updated_at'>>;
      };
      working_hours: {
        Row: WorkingHours;
        Insert: Omit<WorkingHours, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<WorkingHours, 'id' | 'created_at' | 'updated_at'>>;
      };
      settings: {
        Row: Setting;
        Insert: Omit<Setting, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Setting, 'id' | 'created_at' | 'updated_at'>>;
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: Omit<ContactMessage, 'id' | 'created_at' | 'is_read' | 'replied_at'>;
        Update: Partial<Omit<ContactMessage, 'id' | 'created_at'>>;
      };
      testimonials: {
        Row: Testimonial;
        Insert: Omit<Testimonial, 'id' | 'created_at'>;
        Update: Partial<Omit<Testimonial, 'id' | 'created_at'>>;
      };
      pricing_packages: {
        Row: PricingPackage;
        Insert: Omit<PricingPackage, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PricingPackage, 'id' | 'created_at' | 'updated_at'>>;
      };
      discount_section: {
        Row: DiscountSection;
        Insert: Omit<DiscountSection, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DiscountSection, 'id' | 'created_at' | 'updated_at'>>;
      };
      hero_section: {
        Row: HeroSection;
        Insert: Omit<HeroSection, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<HeroSection, 'id' | 'created_at' | 'updated_at'>>;
      };
      treatment_programs: {
        Row: TreatmentProgram;
        Insert: Omit<TreatmentProgram, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TreatmentProgram, 'id' | 'created_at' | 'updated_at'>>;
      };
      treatment_section: {
        Row: TreatmentSection;
        Insert: Omit<TreatmentSection, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TreatmentSection, 'id' | 'created_at' | 'updated_at'>>;
      };
      contact_settings: {
        Row: ContactSettings;
        Insert: Omit<ContactSettings, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ContactSettings, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Functions: {
      is_appointment_slot_available: {
        Args: {
          p_date: string;
          p_time: string;
          p_duration_minutes?: number;
        };
        Returns: boolean;
      };
      get_available_slots: {
        Args: {
          p_date: string;
        };
        Returns: TimeSlot[];
      };
    };
  };
}
