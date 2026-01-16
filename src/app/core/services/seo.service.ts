import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonicalUrl?: string;
  noIndex?: boolean;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly document = inject(DOCUMENT);

  private readonly siteName = 'أسعار الذهب في الإمارات - UAE Gold Prices';
  private readonly defaultImage = 'https://goldpriceinemirates.com/images/logo/logo.webp';
  private readonly siteUrl = 'https://goldpriceinemirates.com';
  private readonly twitterHandle = '@uaegoldprices';

  /**
   * Update all SEO meta tags for a page
   */
  updateMetaTags(config: SeoConfig): void {
    const fullTitle = `${config.title} | ${this.siteName}`;
    
    // Set page title
    this.titleService.setTitle(fullTitle);

    // Primary meta tags
    this.updateTag('name', 'description', config.description);
    this.updateTag('name', 'keywords', config.keywords ?? this.getDefaultKeywords());
    this.updateTag('name', 'author', config.author ?? 'UAE Gold Prices');
    
    // Robots meta tag
    if (config.noIndex) {
      this.updateTag('name', 'robots', 'noindex, nofollow');
    } else {
      this.updateTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    // Open Graph tags for social sharing
    this.updateTag('property', 'og:title', fullTitle);
    this.updateTag('property', 'og:description', config.description);
    this.updateTag('property', 'og:image', config.ogImage ?? this.defaultImage);
    this.updateTag('property', 'og:type', config.ogType ?? 'website');
    this.updateTag('property', 'og:url', config.canonicalUrl ?? this.siteUrl);
    this.updateTag('property', 'og:site_name', this.siteName);
    this.updateTag('property', 'og:locale', 'ar_AE');
    this.updateTag('property', 'og:locale:alternate', 'en_AE');

    // Twitter Card tags
    this.updateTag('name', 'twitter:card', 'summary_large_image');
    this.updateTag('name', 'twitter:site', this.twitterHandle);
    this.updateTag('name', 'twitter:title', fullTitle);
    this.updateTag('name', 'twitter:description', config.description);
    this.updateTag('name', 'twitter:image', config.ogImage ?? this.defaultImage);

    // Article specific tags
    if (config.ogType === 'article') {
      if (config.publishedTime) {
        this.updateTag('property', 'article:published_time', config.publishedTime);
      }
      if (config.modifiedTime) {
        this.updateTag('property', 'article:modified_time', config.modifiedTime);
      }
      this.updateTag('property', 'article:author', config.author ?? 'UAE Gold Prices');
    }

    // Update canonical URL
    this.updateCanonicalUrl(config.canonicalUrl ?? this.siteUrl);
  }

  /**
   * Update or create a meta tag
   */
  private updateTag(attrSelector: 'name' | 'property', name: string, content: string): void {
    const selector = `${attrSelector}="${name}"`;
    
    if (this.meta.getTag(selector)) {
      this.meta.updateTag({ [attrSelector]: name, content });
    } else {
      this.meta.addTag({ [attrSelector]: name, content });
    }
  }

  /**
   * Update canonical URL link element
   */
  private updateCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    
    link.setAttribute('href', url);
  }

  /**
   * Get default keywords for the site
   */
  private getDefaultKeywords(): string {
    return 'أسعار الذهب, الذهب في الإمارات, سعر الذهب اليوم, gold price UAE, Dubai gold price, gold rate Emirates, حاسبة الذهب, أسعار الذهب دبي, أسعار الذهب أبوظبي, عيار 24, عيار 22, عيار 21, عيار 18, gold calculator, currency converter UAE';
  }

  /**
   * Get the site URL
   */
  getSiteUrl(): string {
    return this.siteUrl;
  }
}
