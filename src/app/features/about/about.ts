import { Component } from '@angular/core';
import { HeroSection } from "../../shared/components/hero-section/hero-section";
import { SectionTitle } from "../../shared/components/section-title/section-title";

@Component({
  selector: 'app-about',
  imports: [HeroSection, SectionTitle],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {

}
