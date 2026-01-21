import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { FontPreloadService } from '../services/font-preload.service';

export const fontPreloadResolver: ResolveFn<void> = (route) => {
  const fontPreload = inject(FontPreloadService);
  const fonts = route.data['preloadFonts'] as string[] | undefined;

  if (fonts?.length) {
    fontPreload.preloadFonts(fonts);
  }
};
