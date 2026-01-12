import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionTitle } from "../../../shared/components/section-title/section-title";

@Component({
  selector: 'app-home-blogs',
  imports: [SectionTitle, RouterLink],
  templateUrl: './home-blogs.html',
  styleUrl: './home-blogs.css',
})
export class HomeBlogs {

}
