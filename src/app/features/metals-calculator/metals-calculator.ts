import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { API_END_POINTS } from '../../core/constant/ApiEndPoints';
import { ApiService } from '../../core/services/api-service';
import { HeroSection } from '../../shared/components/hero-section/hero-section';
import { SectionTitle } from '../../shared/components/section-title/section-title';

const METALS_CALC_STORAGE_KEY = 'metals_calculator_result';

interface Metal {
  code: string;
  name: string;
}

interface Karat {
  name: string;
  value: number;
}

interface Currency {
  name: string;
  code: string;
  flag: string;
}

// API Response interfaces matching actual API structure
interface MetalsApiResponse {
  success: boolean;
  data: Record<string, string>;
}

interface GoldApiResponse {
  success: boolean;
  data: number[];
}

interface CurrencyApiResponse {
  success: boolean;
  currencies: Record<string, string>;
}

interface PriceCalculatorResponse {
  success: boolean;
  metal: string;
  currency: string;
  price_per_gram: number;
  total_price: number;
}

interface RateLimitError {
  status: boolean;
  message: string;
  retry_after_seconds: number;
  retry_after_minutes: number;
}

@Component({
  selector: 'app-metals-calculator',
  imports: [HeroSection, SectionTitle, FormsModule, Select],
  templateUrl: './metals-calculator.html',
  styleUrl: './metals-calculator.css',
})
export class MetalsCalculator implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly platformId = inject(PLATFORM_ID);

  // Loading states
  isLoadingMetals = signal(true);
  isLoadingGold = signal(true);
  isLoadingCurrencies = signal(true);
  isCalculating = signal(false);

  // API Data Signals
  metals = signal<Metal[]>([]);
  karats = signal<Karat[]>([]);
  currencies = signal<Currency[]>([]);

  // Form values - using objects for PrimeNG Select
  selectedMetal: Metal | null = null;
  selectedKarat: Karat | null = null;
  selectedCurrency: Currency | null = null;
  weight: number | null = null;

  // Result signals
  result = signal<number | null>(null);
  pricePerGram = signal<number | null>(null);
  showResult = signal<boolean>(false);

  // Rate limiting (12 hours cooldown)
  private readonly COOLDOWN_HOURS = 12;
  remainingTime = signal<{ hours: number; minutes: number } | null>(null);

  // Validation signals
  isSubmitted = signal<boolean>(false);
  metalTouched = signal<boolean>(false);
  karatTouched = signal<boolean>(false);
  weightTouched = signal<boolean>(false);
  currencyTouched = signal<boolean>(false);

  // Rate limit error
  rateLimitError = signal<{ message: string; hours: number; minutes: number } | null>(null);

  // Metal name mapping for Arabic display
  private metalNamesAr: Record<string, string> = {
    gold: 'ذهب',
    silver: 'فضة',
    platinum: 'بلاتين',
    palladium: 'بالاديوم',
  };

  // Currency code to flag mapping (ISO 3166-1 alpha-2)
  private currencyFlagMap: Record<string, string> = {
    USD: 'us',
    EUR: 'eu',
    GBP: 'gb',
    JPY: 'jp',
    CHF: 'ch',
    CAD: 'ca',
    AUD: 'au',
    EGP: 'eg',
    SAR: 'sa',
    AED: 'ae',
    QAR: 'qa',
    KWD: 'kw',
    BHD: 'bh',
    OMR: 'om',
    JOD: 'jo',
    ILS: 'il',
    IQD: 'iq',
    LBP: 'lb',
    YER: 'ye',
    ZAR: 'za',
    MAD: 'ma',
    TND: 'tn',
    DZD: 'dz',
    SDG: 'sd',
    NGN: 'ng',
    KES: 'ke',
    CNY: 'cn',
    INR: 'in',
    PKR: 'pk',
    BDT: 'bd',
    KRW: 'kr',
    SGD: 'sg',
    HKD: 'hk',
    THB: 'th',
    MYR: 'my',
    IDR: 'id',
    SEK: 'se',
    NOK: 'no',
    DKK: 'dk',
    PLN: 'pl',
    CZK: 'cz',
    HUF: 'hu',
    UAH: 'ua',
    BRL: 'br',
    MXN: 'mx',
    ARS: 'ar',
    CLP: 'cl',
    COP: 'co',
    TRY: 'tr',
    SYP: 'sy',
  };

  ngOnInit(): void {
    this.fetchMetalsList();
    this.fetchGoldList();
    this.fetchCurrencyList();
    this.loadSavedResult();
  }

  private fetchMetalsList(): void {
    this.apiService.get<MetalsApiResponse>(API_END_POINTS.METALS_LIST).subscribe({
      next: (response) => {
        if (response?.success && response.data) {
          const metalsArray: Metal[] = Object.entries(response.data).map(([key, value]) => ({
            code: key,
            name: this.metalNamesAr[key] ?? value,
          }));
          this.metals.set(metalsArray);
        }
        this.isLoadingMetals.set(false);
      },
      error: () => {
        this.isLoadingMetals.set(false);
      },
    });
  }

  private fetchGoldList(): void {
    this.apiService.get<GoldApiResponse>(API_END_POINTS.GOLD_LIST).subscribe({
      next: (response) => {
        if (response?.success && response.data) {
          const karatsArray: Karat[] = response.data
            .sort((a, b) => b - a)
            .map((value) => ({
              name: `${value} `,
              value: value,
            }));
          this.karats.set(karatsArray);
        }
        this.isLoadingGold.set(false);
      },
      error: () => {
        this.isLoadingGold.set(false);
      },
    });
  }

  private fetchCurrencyList(): void {
    this.apiService.get<CurrencyApiResponse>(API_END_POINTS.CURRENCY_COUNTRY_LIST).subscribe({
      next: (response) => {
        if (response?.success && response.currencies) {
          // Transform { "USD": "الدولار الأمريكي" } to [{ code: "USD", name: "الدولار الأمريكي", flag: "us" }]
          const currenciesArray: Currency[] = Object.entries(response.currencies).map(([code, name]) => ({
            code,
            name,
            flag: this.currencyFlagMap[code] ?? '',
          }));
          this.currencies.set(currenciesArray);

          // Set default currency (AED or first available)
          const defaultCurrency = currenciesArray.find((c) => c.code === 'AED') ?? currenciesArray[0];
          if (defaultCurrency && !this.selectedCurrency) {
            this.selectedCurrency = defaultCurrency;
          }
        }
        this.isLoadingCurrencies.set(false);
      },
      error: () => {
        this.isLoadingCurrencies.set(false);
      },
    });
  }

  // Validation methods
  isMetalInvalid(): boolean {
    return (this.isSubmitted() || this.metalTouched()) && !this.selectedMetal;
  }

  isKaratInvalid(): boolean {
    return (this.isSubmitted() || this.karatTouched()) && !this.selectedKarat;
  }

  isWeightInvalid(): boolean {
    return (this.isSubmitted() || this.weightTouched()) && (!this.weight || this.weight <= 0);
  }

  isCurrencyInvalid(): boolean {
    return (this.isSubmitted() || this.currencyTouched()) && !this.selectedCurrency;
  }

  isFormValid(): boolean {
    return !!this.selectedMetal && !!this.selectedKarat && !!this.weight && this.weight > 0 && !!this.selectedCurrency;
  }

  onMetalChange(): void {
    this.metalTouched.set(true);
  }

  onKaratChange(): void {
    this.karatTouched.set(true);
  }

  onWeightBlur(): void {
    this.weightTouched.set(true);
  }

  onCurrencyChange(): void {
    this.currencyTouched.set(true);
  }

  // Rate limiting methods
  canCalculate(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const savedData = localStorage.getItem(METALS_CALC_STORAGE_KEY);
      if (!savedData) return true;
      
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.timestamp) {
          const hoursDiff = (Date.now() - parsed.timestamp) / (1000 * 60 * 60);
          return hoursDiff >= this.COOLDOWN_HOURS;
        }
      } catch {
        return true;
      }
    }
    return true;
  }

  updateRemainingTime(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedData = localStorage.getItem(METALS_CALC_STORAGE_KEY);
      if (!savedData) {
        this.remainingTime.set(null);
        return;
      }
      
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.timestamp) {
          const hoursDiff = (Date.now() - parsed.timestamp) / (1000 * 60 * 60);
          
          if (hoursDiff < this.COOLDOWN_HOURS) {
            const remaining = this.COOLDOWN_HOURS - hoursDiff;
            this.remainingTime.set({
              hours: Math.floor(remaining),
              minutes: Math.floor((remaining % 1) * 60)
            });
          } else {
            this.remainingTime.set(null);
          }
        }
      } catch {
        this.remainingTime.set(null);
      }
    }
  }

  calculatePrice(): void {
    this.isSubmitted.set(true);

    if (!this.isFormValid()) {
      return;
    }

    if (!this.canCalculate()) {
      return;
    }

    this.isCalculating.set(true);
    this.showResult.set(false);

    const queryParams = new URLSearchParams({
      metal: this.selectedMetal!.code,
      karat: this.selectedKarat!.value.toString(),
      currency: this.selectedCurrency!.code,
      weight: this.weight!.toString(),
    });

    const endpoint = `${API_END_POINTS.GOLD_PRICE_CALCULATOR}?${queryParams.toString()}`;

    this.apiService.get<PriceCalculatorResponse>(endpoint).subscribe({
      next: (response) => {
        if (response?.success && response.total_price) {
          this.result.set(response.total_price);
          this.pricePerGram.set(response.price_per_gram);
          this.showResult.set(true);
          this.rateLimitError.set(null);
          console.log(response);
          this.saveResultToStorage(response.total_price, response.price_per_gram);
        }
        this.isCalculating.set(false);
      },
      error: (error) => {
        console.log('API Error:', error);
        this.isCalculating.set(false);
        if (error.status === 429 && error.error) {
          const rateLimitData = error.error as RateLimitError;
          const { hours, minutes } = this.convertSecondsToHoursMinutes(rateLimitData.retry_after_seconds);
          this.rateLimitError.set({
            message: rateLimitData.message,
            hours,
            minutes
          });
        }
      },
    });
  }

  formatPrice(price: number): string {
    return price.toLocaleString('ar-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  resetCalculator(): void {
    // Only allow reset if cooldown has expired
    if (!this.canCalculate()) {
      return;
    }
    this.result.set(null);
    this.pricePerGram.set(null);
    this.showResult.set(false);
    this.remainingTime.set(null);
    this.clearStoredResult();
    // Reset validation state
    this.isSubmitted.set(false);
    this.metalTouched.set(false);
    this.karatTouched.set(false);
    this.weightTouched.set(false);
    this.currencyTouched.set(false);
  }

  private loadSavedResult(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedData = localStorage.getItem(METALS_CALC_STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.price && parsed.timestamp) {
            // Always show saved result (don't clear on expiration)
            this.result.set(parsed.price);
            this.pricePerGram.set(parsed.pricePerGram ?? null);
            this.showResult.set(true);
            // Restore selections
            if (parsed.metalCode) {
              this.selectedMetal = { 
                code: parsed.metalCode, 
                name: this.metalNamesAr[parsed.metalCode] ?? parsed.metalCode 
              };
            }
            if (parsed.karatValue) {
              this.selectedKarat = { 
                name: `${parsed.karatValue} `, 
                value: parsed.karatValue 
              };
            }
            this.selectedCurrency = { 
              code: parsed.currencyCode, 
              name: parsed.currencyName ?? '', 
              flag: this.currencyFlagMap[parsed.currencyCode] ?? '' 
            };
            this.weight = parsed.weight ?? null;
            // Update remaining time for cooldown
            this.updateRemainingTime();
          }
        } catch {
          this.clearStoredResult();
        }
      }
    }
  }

  private saveResultToStorage(price: number, pricePerGram: number): void {
    if (isPlatformBrowser(this.platformId) && this.selectedCurrency && this.selectedMetal && this.selectedKarat) {
      const dataToSave = {
        price,
        pricePerGram,
        metalCode: this.selectedMetal.code,
        karatValue: this.selectedKarat.value,
        currencyCode: this.selectedCurrency.code,
        currencyName: this.selectedCurrency.name,
        weight: this.weight,
        timestamp: Date.now(),
      };
      localStorage.setItem(METALS_CALC_STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }

  private clearStoredResult(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(METALS_CALC_STORAGE_KEY);
    }
  }

  private convertSecondsToHoursMinutes(seconds: number): { hours: number; minutes: number } {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return { hours, minutes };
  }

  dismissRateLimitError(): void {
    this.rateLimitError.set(null);
  }
}
