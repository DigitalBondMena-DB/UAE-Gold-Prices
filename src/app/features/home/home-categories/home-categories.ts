import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionTitle } from '../../../shared/components/section-title/section-title';

@Component({
  selector: 'app-home-categories',
  imports: [SectionTitle, RouterLink],
  templateUrl: './home-categories.html',
  styleUrl: './home-categories.css',
})
export class HomeCategories {

}
