import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { API_END_POINTS } from '../../core/constant/ApiEndPoints';
import { ApiService } from '../../core/services/api-service';
import { HeroSection } from '../../shared/components/hero-section/hero-section';

const GOLD_CALC_STORAGE_KEY = 'gold_calculator_result';

interface Currency {
  name: string;
  code: string;
  flag: string;
}

interface Karat {
  name: string;
  value: number;
}

interface CurrencyApiResponse {
  success: boolean;
  currencies: Record<string, string>;
}

interface GoldApiResponse {
  success: boolean;
  data: number[];
}

interface PriceCalculatorResponse {
  success: boolean;
  metal: string;
  currency: string;
  price_per_gram: number;
  total_price: number;
}

@Component({
  selector: 'app-gold-calculator',
  imports: [HeroSection, FormsModule, Select],
  templateUrl: './gold-calculator.html',
  styleUrl: './gold-calculator.css',
})
export class GoldCalculator implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly platformId = inject(PLATFORM_ID);

  // Loading states
  isLoadingCurrencies = signal(true);
  isLoadingKarats = signal(true);

  // API Data Signals
  currencies = signal<Currency[]>([]);
  karats = signal<Karat[]>([]);

  // Form values
  selectedCurrency: Currency | null = null;
  selectedKarat: Karat | null = null;
  weight: number | null = null;
  
  // Result signals
  result = signal<number | null>(null);
  pricePerGram = signal<number | null>(null);
  showResult = signal<boolean>(false);
  isCalculating = signal(false);

  // Rate limiting (12 hours cooldown)
  private readonly COOLDOWN_HOURS = 12;
  remainingTime = signal<{ hours: number; minutes: number } | null>(null);

  // Validation signals
  isSubmitted = signal<boolean>(false);
  currencyTouched = signal<boolean>(false);
  weightTouched = signal<boolean>(false);
  karatTouched = signal<boolean>(false);

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
    this.fetchCurrencyList();
    this.fetchGoldList();
    this.loadSavedResult();
  }

  private fetchCurrencyList(): void {
    this.apiService.get<CurrencyApiResponse>(API_END_POINTS.CURRENCY_COUNTRY_LIST).subscribe({
      next: (response) => {
        if (response?.success && response.currencies) {
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
        this.isLoadingKarats.set(false);
      },
      error: () => {
        this.isLoadingKarats.set(false);
      },
    });
  }

  // Validation methods
  isCurrencyInvalid(): boolean {
    return (this.isSubmitted() || this.currencyTouched()) && !this.selectedCurrency;
  }

  isWeightInvalid(): boolean {
    return (this.isSubmitted() || this.weightTouched()) && (!this.weight || this.weight <= 0);
  }

  isKaratInvalid(): boolean {
    return (this.isSubmitted() || this.karatTouched()) && !this.selectedKarat;
  }

  isFormValid(): boolean {
    return !!this.selectedCurrency && !!this.weight && this.weight > 0 && !!this.selectedKarat;
  }

  onCurrencyChange(): void {
    this.currencyTouched.set(true);
  }

  onWeightBlur(): void {
    this.weightTouched.set(true);
  }

  onKaratChange(): void {
    this.karatTouched.set(true);
  }

  // Rate limiting methods
  canCalculate(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const savedData = localStorage.getItem(GOLD_CALC_STORAGE_KEY);
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
      const savedData = localStorage.getItem(GOLD_CALC_STORAGE_KEY);
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
      metal: 'gold',
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
          console.log(response);
          this.saveResultToStorage(response.total_price, response.price_per_gram);
        }
        this.isCalculating.set(false);
      },
      error: () => {
        this.isCalculating.set(false);
      },
    });
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
    this.currencyTouched.set(false);
    this.weightTouched.set(false);
    this.karatTouched.set(false);
  }

  private loadSavedResult(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedData = localStorage.getItem(GOLD_CALC_STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.price && parsed.currencyCode && parsed.timestamp) {
            // Always show saved result (don't clear on expiration)
            this.result.set(parsed.price);
            this.pricePerGram.set(parsed.pricePerGram ?? null);
            this.showResult.set(true);
            // Restore currency selection
            this.selectedCurrency = { 
              code: parsed.currencyCode, 
              name: parsed.currencyName ?? '', 
              flag: this.currencyFlagMap[parsed.currencyCode] ?? '' 
            };
            // Restore weight
            this.weight = parsed.weight ?? null;
            // Restore karat selection
            if (parsed.karatValue) {
              this.selectedKarat = { 
                name: `${parsed.karatValue} `, 
                value: parsed.karatValue 
              };
            }
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
    if (isPlatformBrowser(this.platformId) && this.selectedCurrency && this.selectedKarat) {
      const dataToSave = {
        price,
        pricePerGram,
        currencyCode: this.selectedCurrency.code,
        currencyName: this.selectedCurrency.name,
        weight: this.weight,
        karatValue: this.selectedKarat.value,
        timestamp: Date.now(),
      };
      localStorage.setItem(GOLD_CALC_STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }

  private clearStoredResult(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(GOLD_CALC_STORAGE_KEY);
    }
  }

  formatPrice(price: number): string {
    return price.toLocaleString('ar-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
