import { Component, inject, OnInit } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-currency-calculator',
  imports: [],
  templateUrl: './currency-calculator.html',
  styleUrl: './currency-calculator.css',
})
export class CurrencyCalculator implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.setSeoTags();
  }

  private setSeoTags(): void {
    this.seoService.updateMetaTags({
      title: 'محول العملات',
      description: 'حول العملات بأسعار صرف محدثة يومياً. محول عملات دقيق يدعم الدرهم الإماراتي والدولار واليورو والريال والعملات العالمية الأخرى.',
      keywords: 'محول العملات, تحويل العملات, سعر الصرف, currency converter UAE, AED to USD, سعر الدولار, سعر الدرهم',
      canonicalUrl: `${this.seoService.getSiteUrl()}/currency-calculator`,
      ogType: 'website'
    });
  }
}
