import { Routes } from '@angular/router';
import { fontPreloadResolver } from './core/resolvers/font-preload.resolver';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
    {
        path: '', component: MainLayout,
        children: [
            {
                path: '',
                loadComponent: () => import('./features/home/home').then(m => m.Home),
            },
            {
                path: 'about-us',
                loadComponent: () => import('./features/about/about').then(m => m.About),
            },
            {
                path: 'department/:slug',
                loadComponent: () => import('./features/department/department').then(m => m.Department),
            },
            {
                path: 'metals-calculator',
                loadComponent: () => import('./features/metals-calculator/metals-calculator').then(m => m.MetalsCalculator),
                resolve: { fonts: fontPreloadResolver },
                data: {
                    preloadFonts: [
                        '/fonts/markazi/MarkaziText-Bold.woff2',
                        '/fonts/tajawal/Tajawal-Regular.woff2',
                        '/fonts/tajawal/Tajawal-Medium.woff2',
                        '/fonts/tajawal/Tajawal-Bold.woff2'
                    ]
                }
            },
            {
                path: 'gold-price',
                loadComponent: () => import('./features/gold-calculator/gold-calculator').then(m => m.GoldCalculator),
                resolve: { fonts: fontPreloadResolver },
                data: {
                    preloadFonts: [
                        '/fonts/markazi/MarkaziText-Bold.woff2',
                        '/fonts/tajawal/Tajawal-Regular.woff2',
                        '/fonts/tajawal/Tajawal-Medium.woff2',
                        '/fonts/tajawal/Tajawal-Bold.woff2'
                    ]
                }
            },
            {
                path: 'currency-calculator',
                loadComponent: () => import('./features/currency-calculator/currency-calculator').then(m => m.CurrencyCalculator),
                resolve: { fonts: fontPreloadResolver },
                data: {
                    preloadFonts: [
                        '/fonts/markazi/MarkaziText-Bold.woff2',
                        '/fonts/tajawal/Tajawal-Regular.woff2',
                        '/fonts/tajawal/Tajawal-Medium.woff2',
                        '/fonts/tajawal/Tajawal-Bold.woff2'
                    ]
                }
            },
            {
                path: 'blogs',
                loadComponent: () => import('./features/blogs/blogs').then(m => m.Blogs),
                resolve: { fonts: fontPreloadResolver },
                data: {
                    preloadFonts: [
                        '/fonts/markazi/MarkaziText-Bold.woff2',
                        '/fonts/tajawal/Tajawal-Regular.woff2',
                        '/fonts/tajawal/Tajawal-Medium.woff2',
                        '/fonts/tajawal/Tajawal-Bold.woff2'
                    ]
                }
            },
            {
                path: 'blog/:slug',
                loadComponent: () => import('./features/blog-det/blog-det').then(m => m.BlogDet),
            },
            {
                path: 'contact-us',
                loadComponent: () => import('./features/contact-us/contact-us').then(m => m.ContactUs),
                children: [
                    {
                        path: 'done',
                        loadComponent: () => import('./features/contact-us/contact-success/contact-success').then(m => m.ContactSuccess),
                    },
                ],
            },
            {
                path: 'privacy-policy',
                loadComponent: () => import('./features/privacy-policy/privacy-policy').then(m => m.PrivacyPolicy),
            },
        ]
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
