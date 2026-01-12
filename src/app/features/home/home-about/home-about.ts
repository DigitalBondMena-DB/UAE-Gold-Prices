import { Component } from '@angular/core';
import { SectionTitle } from "../../../shared/components/section-title/section-title";
import { AppButton } from "../../../shared/components/app-button/app-button";

@Component({
  selector: 'app-home-about',
  imports: [SectionTitle, AppButton],
  templateUrl: './home-about.html',
  styleUrl: './home-about.css',
})
export class HomeAbout {

}
