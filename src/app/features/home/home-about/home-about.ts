import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { API_END_POINTS } from '../../../core/constant/ApiEndPoints';
import { ContactInfo } from '../../../core/models/contact.model';
import { AboutHome } from '../../../core/models/home.model';
import { ApiService } from '../../../core/services/api-service';
import { AppButton } from '../../../shared/components/app-button/app-button';
import { SectionTitle } from '../../../shared/components/section-title/section-title';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-about',
  imports: [SectionTitle, AppButton, RouterLink],
  templateUrl: './home-about.html',
  styleUrl: './home-about.css',
})
export class HomeAbout implements OnInit {
  private readonly apiService = inject(ApiService);
  
  aboutData = input<AboutHome | null>(null);
  
  // Contact info signal
  contactInfo = signal<ContactInfo | null>(null);
  
  // Computed signal that returns the first non-null URL as fallback
  fallbackUrl = computed(() => {
    const info = this.contactInfo();
    if (!info) return '#';
    
    return info.facebook_url 
      ?? info.instagram_url 
      ?? info.twitter_url 
      ?? info.tiktok_url 
      ?? info.linkedin_url 
      ?? info.youtube_url 
      ?? info.whatsapp_number 
      ?? info.telegram_url 
      ?? info.snapchat_url 
      ?? '#';
  });
  
  // Social media URLs with fallback
  facebookUrl = computed(() => this.contactInfo()?.facebook_url ?? this.fallbackUrl());
  instagramUrl = computed(() => this.contactInfo()?.instagram_url ?? this.fallbackUrl());
  twitterUrl = computed(() => this.contactInfo()?.twitter_url ?? this.fallbackUrl());
  tiktokUrl = computed(() => this.contactInfo()?.tiktok_url ?? this.fallbackUrl());

  ngOnInit(): void {
    this.fetchContactInfo();
  }

  private fetchContactInfo(): void {
    this.apiService.get<ContactInfo>(API_END_POINTS.CONTACT_INFO).subscribe({
      next: (response) => {
        if (response) {
          this.contactInfo.set(response);
        }
      }
    });
  }
}
