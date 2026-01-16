import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { API_END_POINTS } from '../../core/constant/ApiEndPoints';
import { AboutResponse } from '../../core/models/about.model';
import { ApiService } from '../../core/services/api-service';
import { SeoService } from '../../core/services/seo.service';
import { HeroSection } from '../../shared/components/hero-section/hero-section';
import { SectionTitle } from '../../shared/components/section-title/section-title';

@Component({
  selector: 'app-about',
  imports: [HeroSection, SectionTitle],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly seoService = inject(SeoService);

  // API Data Signal
  aboutData = signal<AboutResponse | null>(null);

  // Computed signals for each section
  bannerSection = computed(() => this.aboutData()?.bannerSection ?? null);
  vision = computed(() => this.aboutData()?.visions?.text ?? '');
  mission = computed(() => this.aboutData()?.misssions?.text ?? '');
  message = computed(() => this.aboutData()?.messages?.text ?? '');
  why = computed(() => this.aboutData()?.why?.text ?? '');

  // Hero section computed values from API
  heroTitle = computed(() => this.bannerSection()?.title ?? '');
  heroSubtitle = computed(() => this.bannerSection()?.text ?? '');
  heroImage = computed(() => this.bannerSection()?.main_image ?? '');

  ngOnInit(): void {
    this.fetchAboutData();
    this.setSeoTags();
  }

  private setSeoTags(): void {
    this.seoService.updateMetaTags({
      title: 'من نحن',
      description: 'تعرف على موقع أسعار الذهب في الإمارات - مصدرك الموثوق لمتابعة أسعار الذهب اليومية في دبي وأبوظبي والشارقة. رؤيتنا ورسالتنا في تقديم أفضل خدمة لمتابعي أسعار الذهب.',
      keywords: 'من نحن, عن الموقع, أسعار الذهب الإمارات, موقع الذهب, about UAE gold prices',
      canonicalUrl: `${this.seoService.getSiteUrl()}/about-us`,
      ogType: 'website'
    });
  }

  private fetchAboutData(): void {
    this.apiService.get<AboutResponse>(API_END_POINTS.ABOUT).subscribe({
      next: (response) => {
        if (response) {
          this.aboutData.set(response);
        }
      }
    });
  }
}
