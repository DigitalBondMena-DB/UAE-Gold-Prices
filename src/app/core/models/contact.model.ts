// Contact Page API Response Interface

export interface ContactInfo {
  email: string;
  phone: string;
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
