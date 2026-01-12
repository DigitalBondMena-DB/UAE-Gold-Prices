import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Carousel } from 'primeng/carousel';
import { HomeAbout } from "./home-about/home-about";
import { HomeBlogs } from "./home-blogs/home-blogs";
import { HomeCalculator } from "./home-calculator/home-calculator";
import { HomeCategories } from "./home-categories/home-categories";

interface CarouselItem {
  title: string;
  image: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, HomeAbout, HomeCategories, HomeCalculator, HomeBlogs, Carousel],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  carouselItems: CarouselItem[] = [
    { title: 'اتجاهات الذهب', image: '/images/hero/slider1.png' },
    { title: 'وقت الشراء؟', image: '/images/hero/slider2.png' },
    { title: 'تحليل الذهب اليوم', image: '/images/hero/slider3.png' },
    { title: 'دليلك الكامل لفهم حركة الذهب عالميًا وكيفية اتخاذ قرار', image: '/images/hero/slider4.png' },
    { title: 'أسعار الذهب اليوم', image: '/images/hero/slider1.png' },
    { title: 'توقعات أسعار الذهب', image: '/images/hero/slider2.png' },
    { title: 'الاستثمار في الذهب', image: '/images/hero/slider3.png' },
    { title: 'أخبار الذهب العالمية', image: '/images/hero/slider4.png' },
  ];

  responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 4,
      numScroll: 1
    },
    {
      breakpoint: '1199px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '991px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1
    }
  ];
}
