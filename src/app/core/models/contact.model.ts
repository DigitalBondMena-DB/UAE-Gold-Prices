// Contact Page API Response Interface

export interface ContactInfo {
  email: string | null;
  phone: string | null;
  footer_text: string | null;
  working_hours: string | null;
  whatsapp_number: string | null;
  address: string | null;
  map_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  snapchat_url: string | null;
  telegram_url: string | null;
}

export interface ContactBanner {
  title: string;
  text: string;
  main_image: string;
}

export interface ContactResponse {
  bannerSection: ContactBanner;
  contactInfo: ContactInfo;
}
