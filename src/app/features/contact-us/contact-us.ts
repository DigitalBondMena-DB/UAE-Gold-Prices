import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { API_END_POINTS } from '../../core/constant/ApiEndPoints';
import { COUNTRIES, Country } from '../../core/data/countries';
import { ContactBanner, ContactInfo, ContactPageResponse } from '../../core/models/contact.model';
import { ApiService } from '../../core/services/api-service';
import { SeoService } from '../../core/services/seo.service';
import { HeroSection } from '../../shared/components/hero-section/hero-section';
import { SectionTitle } from '../../shared/components/section-title/section-title';

@Component({
  selector: 'app-contact-us',
  imports: [
    ReactiveFormsModule,
    RouterOutlet,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    HeroSection,
    SectionTitle,
  ],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css',
})
export class ContactUs implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly seoService = inject(SeoService);

  // Data signals
  bannerSection = signal<ContactBanner | null>(null);
  contactInfo = signal<ContactInfo | null>(null);
  isLoading = signal(false);
  isSubmitting = signal(false);
  submitError = signal<string | null>(null);

  // Countries data for phone input
  countries = COUNTRIES;
  selectedCountry = signal<Country>(COUNTRIES[0]); // Default to Saudi Arabia
  showCountryDropdown = signal(false);

  // Regex pattern: allows letters (English & Arabic) and spaces, no numbers
  private namePattern = /^[a-zA-Z\u0600-\u06FF\s]+$/;

  // Custom validator for phone based on country
  private phoneValidator(country: Country): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Don't validate if empty - let required validator handle that
      if (!control.value || control.value.toString().trim() === '') {
        return null;
      }
      
      const value = control.value.toString().trim();
      const validation = country.phoneValidation;
      const errors: ValidationErrors = {};
      
      if (value.length < validation.minLength) {
        errors['phoneMinLength'] = {
          requiredLength: validation.minLength,
          actualLength: value.length,
          country: country.nameAr
        };
      }
      
      if (value.length > validation.maxLength) {
        errors['phoneMaxLength'] = {
          requiredLength: validation.maxLength,
          actualLength: value.length,
          country: country.nameAr
        };
      }
      
      if (validation.pattern && !validation.pattern.test(value)) {
        errors['phonePattern'] = {
          country: country.nameAr
        };
      }
      
      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  // Contact form
  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(this.namePattern)]],
    email: ['', [Validators.required, Validators.email]],
    countryCode: [COUNTRIES[0]], // Store selected country object
    phone: ['', [Validators.required, this.phoneValidator(COUNTRIES[0])]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit(): void {
    this.loadBannerData();
    this.loadContactInfo();
  }

  private setSeoTags(banner: ContactBanner): void {
    this.seoService.updateMetaTags({
      title: banner.meta_title ?? 'اتصل بنا',
      description: banner.meta_description ?? 'تواصل معنا للاستفسارات والاقتراحات حول أسعار الذهب في الإمارات. نحن هنا لمساعدتك والإجابة على جميع أسئلتك المتعلقة بالذهب والعملات.',
      keywords: 'اتصل بنا, تواصل معنا, contact us, استفسارات الذهب, خدمة العملاء',
      canonicalUrl: `${this.seoService.getSiteUrl()}/contact-us`,
      ogType: 'website'
    });
  }

  loadBannerData(): void {
    this.apiService.get<ContactPageResponse>(API_END_POINTS.CONTACT_US).subscribe({
      next: (response) => {
        if (response?.bannerSection) {
          this.bannerSection.set(response.bannerSection);
          this.setSeoTags(response.bannerSection);
        }
      },
      error: () => {
        // Use default SEO tags on error
        this.setSeoTags({
          small_title: null,
          title: 'تواصل معنا',
          text: '',
          main_image: '',
          meta_title: 'اتصل بنا',
          meta_description: 'تواصل معنا للاستفسارات والاقتراحات',
          page_schema: null,
          page_name: 'contact'
        });
      },
    });
  }

  loadContactInfo(): void {
    this.isLoading.set(true);
    this.apiService.get<ContactInfo>(API_END_POINTS.CONTACT_INFO).subscribe({
      next: (response) => {
        if (response) {
          this.contactInfo.set(response);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const formValue = this.contactForm.value;
    const country = formValue.countryCode as Country;

    // Format phone with country dial code
    const formData = {
      name: formValue.name,
      email: formValue.email,
      phone: `${country.dialCode}${formValue.phone}`,
      message: formValue.message,
    };

    this.apiService.post(API_END_POINTS.SUBMIT_CONTACT_FORM, formData).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        const defaultCountry = COUNTRIES[0];
        this.selectedCountry.set(defaultCountry);
        this.contactForm.reset({ countryCode: defaultCountry });
        
        // Reset phone validation to default country
        const phoneControl = this.contactForm.get('phone');
        if (phoneControl) {
          phoneControl.clearValidators();
          phoneControl.setValidators([Validators.required, this.phoneValidator(defaultCountry)]);
          phoneControl.updateValueAndValidity();
        }
        
        // Navigate to success page
        this.router.navigate(['/contact-us/done']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.submitError.set(err.message ?? 'حدث خطأ أثناء إرسال الرسالة');
      },
    });
  }

  // Filter out non-numeric characters from phone input
  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const country = this.selectedCountry();
    const maxLength = country.phoneValidation.maxLength;
    
    let filteredValue = input.value.replace(/[^0-9]/g, '');
    
    // Limit to max length for selected country
    if (filteredValue.length > maxLength) {
      filteredValue = filteredValue.substring(0, maxLength);
    }
    
    if (input.value !== filteredValue) {
      input.value = filteredValue;
    }
    
    // Update form value and trigger validation
    const phoneControl = this.contactForm.get('phone');
    if (phoneControl) {
      phoneControl.setValue(filteredValue, { emitEvent: true });
      phoneControl.markAsTouched();
    }
  }

  // Toggle country dropdown
  toggleCountryDropdown(): void {
    this.showCountryDropdown.update(v => !v);
  }

  // Select a country from the dropdown
  selectCountry(country: Country): void {
    this.selectedCountry.set(country);
    this.contactForm.get('countryCode')?.setValue(country);
    
    // Update phone validation based on selected country
    const phoneControl = this.contactForm.get('phone');
    if (phoneControl) {
      // Remove old validators
      phoneControl.clearValidators();
      // Add new validators based on country
      phoneControl.setValidators([Validators.required, this.phoneValidator(country)]);
      // Re-validate
      phoneControl.updateValueAndValidity();
    }
    
    this.showCountryDropdown.set(false);
  }

  // Format dial code: +7 -> 7+
  formatDialCode(dialCode: string): string {
    if (dialCode.startsWith('+')) {
      return dialCode.substring(1) + '+';
    }
    return dialCode + '+';
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.country-selector-wrapper') && !target.closest('.country-dropdown-panel')) {
      this.showCountryDropdown.set(false);
    }
  }

  // Filter out numbers from name input in real-time
  onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const filteredValue = input.value.replace(/[0-9]/g, '');
    if (input.value !== filteredValue) {
      input.value = filteredValue;
      this.contactForm.get('name')?.setValue(filteredValue);
    }
  }

  // Helper getters for form validation
  get nameInvalid(): boolean {
    const control = this.contactForm.get('name');
    return !!(control?.invalid && control?.touched);
  }

  get emailInvalid(): boolean {
    const control = this.contactForm.get('email');
    return !!(control?.invalid && control?.touched);
  }

  get phoneInvalid(): boolean {
    const control = this.contactForm.get('phone');
    return !!(control?.invalid && control?.touched);
  }

  // Get country-specific phone error message
  get phoneErrorMessage(): string {
    const control = this.contactForm.get('phone');
    if (!control?.errors || !control?.touched) {
      return '';
    }
    
    const country = this.selectedCountry();
    const validation = country.phoneValidation;
    const errors = control.errors;
    
    // Required error
    if (errors['required']) {
      return `يرجى إدخال رقم الهاتف`;
    }
    
    // Custom min length error with country info
    if (errors['phoneMinLength']) {
      const errorData = errors['phoneMinLength'];
      if (validation.minLength === validation.maxLength) {
        return `رقم الهاتف ${country.nameAr} يجب أن يكون ${validation.minLength} أرقام `;
      }
      return `رقم الهاتف ${country.nameAr} يجب أن يكون ${validation.minLength} أرقام على الأقل (${errorData.actualLength}/${validation.minLength})`;
    }
    
    // Custom max length error with country info
    if (errors['phoneMaxLength']) {
      const errorData = errors['phoneMaxLength'];
      return `رقم الهاتف ${country.nameAr} يجب ألا يتجاوز ${validation.maxLength} رقماً (${errorData.actualLength}/${validation.maxLength})`;
    }
    
    // Pattern error
    if (errors['phonePattern']) {
      return `رقم الهاتف ${country.nameAr} غير صحيح. يرجى التحقق من التنسيق`;
    }
    
    // Fallback for other errors
    if (validation.minLength === validation.maxLength) {
      return `رقم الهاتف ${country.nameAr} يجب أن يكون ${validation.minLength} أرقام `;
    }
    
    return `يرجى إدخال رقم هاتف ${country.nameAr} صحيح (${validation.minLength}-${validation.maxLength} رقم)`;
  }

  get messageInvalid(): boolean {
    const control = this.contactForm.get('message');
    return !!(control?.invalid && control?.touched);
  }
}
