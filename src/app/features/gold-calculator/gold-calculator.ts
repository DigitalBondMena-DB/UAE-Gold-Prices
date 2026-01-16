import { Component, inject, OnInit } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-gold-calculator',
  imports: [],
  templateUrl: './gold-calculator.html',
  styleUrl: './gold-calculator.css',
})
export class GoldCalculator implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.setSeoTags();
  }

  private setSeoTags(): void {
    this.seoService.updateMetaTags({
      title: 'حاسبة الذهب',
      description: 'احسب قيمة الذهب بجميع العيارات (24، 22، 21، 18) بأسعار الذهب الحالية في الإمارات. حاسبة ذهب دقيقة ومحدثة يومياً لحساب سعر الذهب بالجرام والأوقية.',
      keywords: 'حاسبة الذهب, حساب سعر الذهب, gold calculator UAE, سعر جرام الذهب, حاسبة عيار 24, حاسبة عيار 21, gold price calculator',
      canonicalUrl: `${this.seoService.getSiteUrl()}/gold-calculator`,
      ogType: 'website'
    });
  }
}
