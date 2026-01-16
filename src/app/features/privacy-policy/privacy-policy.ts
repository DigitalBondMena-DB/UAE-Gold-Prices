import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { API_END_POINTS } from '../../core/constant/ApiEndPoints';
import { PrivacyPolicyResponse } from '../../core/models/privacy-policy.model';
import { ApiService } from '../../core/services/api-service';
import { SeoService } from '../../core/services/seo.service';
import { HeroSection } from '../../shared/components/hero-section/hero-section';
import { SectionTitle } from '../../shared/components/section-title/section-title';

@Component({
  selector: 'app-privacy-policy',
  imports: [HeroSection, SectionTitle],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.css',
})
export class PrivacyPolicy implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly seoService = inject(SeoService);

  // API Data Signal
  privacyData = signal<PrivacyPolicyResponse | null>(null);

  // Computed signals for each section
  bannerSection = computed(() => this.privacyData()?.bannerSection ?? null);
  privacyPolicy = computed(() => this.privacyData()?.privacyPolicy ?? null);

  // Hero section computed values from API
  heroTitle = computed(() => this.bannerSection()?.title ?? '');
  heroSubtitle = computed(() => this.bannerSection()?.text ?? '');
  heroImage = computed(() => this.bannerSection()?.main_image ?? '');

  // Privacy policy content
  policyTitle = computed(() => this.privacyPolicy()?.title ?? '');
  policyText = computed(() => this.privacyPolicy()?.text ?? '');

  ngOnInit(): void {
    this.fetchPrivacyData();
    this.setSeoTags();
  }

  private setSeoTags(): void {
    this.seoService.updateMetaTags({
      title: 'سياسة الخصوصية',
      description: 'اقرأ سياسة الخصوصية لموقع أسعار الذهب في الإمارات. نحن نحترم خصوصيتك ونحمي بياناتك الشخصية وفقاً لأعلى معايير الأمان.',
      keywords: 'سياسة الخصوصية, حماية البيانات, privacy policy, خصوصية المستخدم',
      canonicalUrl: `${this.seoService.getSiteUrl()}/privacy-policy`,
      ogType: 'website',
      noIndex: false
    });
  }

  private fetchPrivacyData(): void {
    this.apiService.get<PrivacyPolicyResponse>(API_END_POINTS.PRIVACYPOLICY).subscribe({
      next: (response) => {
        if (response) {
          this.privacyData.set(response);
        }
      }
    });
  }
}
