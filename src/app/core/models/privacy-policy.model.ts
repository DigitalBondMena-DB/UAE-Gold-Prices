// Privacy Policy API Response Interface
export interface PrivacyPolicyBannerSection {
  small_title: string | null;
  title: string;
  text: string;
  main_image: string;
  meta_title: string;
  meta_description: string;
  page_schema: string | null;
  page_name: string;
}

export interface PrivacyPolicyContent {
  title: string | null;
  text: string | null;
}

export interface PrivacyPolicyResponse {
  bannerSection: PrivacyPolicyBannerSection;
  privacyPolicy: PrivacyPolicyContent;
}
