import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class FontPreloadService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  preloadFonts(fonts: string[]): void {
    // Only preload during SSR for immediate effect in initial HTML
    if (isPlatformServer(this.platformId)) {
      fonts.forEach(fontPath => {
        const link = this.document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.href = fontPath;
        link.crossOrigin = 'anonymous';
        this.document.head.appendChild(link);
      });
    }
  }
}
