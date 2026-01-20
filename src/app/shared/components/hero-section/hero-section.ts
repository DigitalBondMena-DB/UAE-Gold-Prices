import { Component, input } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  imports: [],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css',
})
export class HeroSection {
  // Hero title (main heading)
  title = input<string>('');
  
  // Hero subtitle/description
  subtitle = input<string>('');
  
  // Background image path
  backgroundImage = input<string>('/images/hero/hero-bg.webp');
  
  // Optional: minimum height class
  minHeight = input<string>('min-h-[85vh]');
}
