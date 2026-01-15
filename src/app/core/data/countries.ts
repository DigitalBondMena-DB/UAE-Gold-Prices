export interface PhoneValidation {
  minLength: number;
  maxLength: number;
  pattern?: RegExp;
}

export interface Country {
  name: string;
  nameAr: string;
  code: string;
  dialCode: string;
  flagUrl: string;
  phoneValidation: PhoneValidation;
  placeholder: string;
}

// Helper function to get flag URL from country code
const getFlagUrl = (code: string): string => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

export const COUNTRIES: Country[] = [
  { name: 'Saudi Arabia', nameAr: 'السعودية', code: 'SA', dialCode: '+966', flagUrl: getFlagUrl('SA'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: '5XX XXX XXX' },
  { name: 'Egypt', nameAr: 'مصر', code: 'EG', dialCode: '+20', flagUrl: getFlagUrl('EG'), phoneValidation: { minLength: 10, maxLength: 10 }, placeholder: '1XXX XXX XXX' },
  { name: 'United Arab Emirates', nameAr: 'الإمارات', code: 'AE', dialCode: '+971', flagUrl: getFlagUrl('AE'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: '5XX XXX XXX' },
  { name: 'Kuwait', nameAr: 'الكويت', code: 'KW', dialCode: '+965', flagUrl: getFlagUrl('KW'), phoneValidation: { minLength: 8, maxLength: 8 }, placeholder: 'XXXX XXXX' },
  { name: 'Qatar', nameAr: 'قطر', code: 'QA', dialCode: '+974', flagUrl: getFlagUrl('QA'), phoneValidation: { minLength: 8, maxLength: 8 }, placeholder: 'XXXX XXXX' },
  { name: 'Bahrain', nameAr: 'البحرين', code: 'BH', dialCode: '+973', flagUrl: getFlagUrl('BH'), phoneValidation: { minLength: 8, maxLength: 8 }, placeholder: 'XXXX XXXX' },
  { name: 'Oman', nameAr: 'عُمان', code: 'OM', dialCode: '+968', flagUrl: getFlagUrl('OM'), phoneValidation: { minLength: 8, maxLength: 8 }, placeholder: 'XXXX XXXX' },
  { name: 'Jordan', nameAr: 'الأردن', code: 'JO', dialCode: '+962', flagUrl: getFlagUrl('JO'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: '7 XXXX XXXX' },
  { name: 'Lebanon', nameAr: 'لبنان', code: 'LB', dialCode: '+961', flagUrl: getFlagUrl('LB'), phoneValidation: { minLength: 8, maxLength: 8 }, placeholder: 'XX XXX XXX' },
  { name: 'Iraq', nameAr: 'العراق', code: 'IQ', dialCode: '+964', flagUrl: getFlagUrl('IQ'), phoneValidation: { minLength: 10, maxLength: 10 }, placeholder: '7XX XXX XXXX' },
  { name: 'Syria', nameAr: 'سوريا', code: 'SY', dialCode: '+963', flagUrl: getFlagUrl('SY'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: '9XX XXX XXX' },
  { name: 'Palestine', nameAr: 'فلسطين', code: 'PS', dialCode: '+970', flagUrl: getFlagUrl('PS'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: '5XX XXX XXX' },
  { name: 'Yemen', nameAr: 'اليمن', code: 'YE', dialCode: '+967', flagUrl: getFlagUrl('YE'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: '7XX XXX XXX' },
  { name: 'Libya', nameAr: 'ليبيا', code: 'LY', dialCode: '+218', flagUrl: getFlagUrl('LY'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: '9X XXX XXXX' },
  { name: 'Tunisia', nameAr: 'تونس', code: 'TN', dialCode: '+216', flagUrl: getFlagUrl('TN'), phoneValidation: { minLength: 8, maxLength: 8 }, placeholder: 'XX XXX XXX' },
  { name: 'Algeria', nameAr: 'الجزائر', code: 'DZ', dialCode: '+213', flagUrl: getFlagUrl('DZ'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: '5XX XXX XXX' },
  { name: 'Morocco', nameAr: 'المغرب', code: 'MA', dialCode: '+212', flagUrl: getFlagUrl('MA'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: '6XX XXX XXX' },
  { name: 'Sudan', nameAr: 'السودان', code: 'SD', dialCode: '+249', flagUrl: getFlagUrl('SD'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: '9XX XXX XXX' },
  { name: 'Somalia', nameAr: 'الصومال', code: 'SO', dialCode: '+252', flagUrl: getFlagUrl('SO'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: '7X XXX XXXX' },
  { name: 'Mauritania', nameAr: 'موريتانيا', code: 'MR', dialCode: '+222', flagUrl: getFlagUrl('MR'), phoneValidation: { minLength: 8, maxLength: 8 }, placeholder: 'XX XX XX XX' },
  { name: 'Djibouti', nameAr: 'جيبوتي', code: 'DJ', dialCode: '+253', flagUrl: getFlagUrl('DJ'), phoneValidation: { minLength: 8, maxLength: 8 }, placeholder: 'XX XX XX XX' },
  { name: 'Comoros', nameAr: 'جزر القمر', code: 'KM', dialCode: '+269', flagUrl: getFlagUrl('KM'), phoneValidation: { minLength: 7, maxLength: 7 }, placeholder: 'XXX XXXX' },
  { name: 'United States', nameAr: 'الولايات المتحدة', code: 'US', dialCode: '+1', flagUrl: getFlagUrl('US'), phoneValidation: { minLength: 10, maxLength: 10 }, placeholder: '(XXX) XXX-XXXX' },
  { name: 'United Kingdom', nameAr: 'المملكة المتحدة', code: 'GB', dialCode: '+44', flagUrl: getFlagUrl('GB'), phoneValidation: { minLength: 10, maxLength: 10 }, placeholder: '7XXX XXXXXX' },
  { name: 'Germany', nameAr: 'ألمانيا', code: 'DE', dialCode: '+49', flagUrl: getFlagUrl('DE'), phoneValidation: { minLength: 10, maxLength: 11 }, placeholder: '1XX XXXXXXX' },
  { name: 'France', nameAr: 'فرنسا', code: 'FR', dialCode: '+33', flagUrl: getFlagUrl('FR'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: 'X XX XX XX XX' },
  { name: 'Italy', nameAr: 'إيطاليا', code: 'IT', dialCode: '+39', flagUrl: getFlagUrl('IT'), phoneValidation: { minLength: 9, maxLength: 10 }, placeholder: '3XX XXX XXXX' },
  { name: 'Spain', nameAr: 'إسبانيا', code: 'ES', dialCode: '+34', flagUrl: getFlagUrl('ES'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: '6XX XXX XXX' },
  { name: 'Netherlands', nameAr: 'هولندا', code: 'NL', dialCode: '+31', flagUrl: getFlagUrl('NL'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: '6 XXXX XXXX' },
  { name: 'Belgium', nameAr: 'بلجيكا', code: 'BE', dialCode: '+32', flagUrl: getFlagUrl('BE'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: '4XX XX XX XX' },
  { name: 'Switzerland', nameAr: 'سويسرا', code: 'CH', dialCode: '+41', flagUrl: getFlagUrl('CH'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: 'XX XXX XX XX' },
  { name: 'Austria', nameAr: 'النمسا', code: 'AT', dialCode: '+43', flagUrl: getFlagUrl('AT'), phoneValidation: { minLength: 10, maxLength: 13 }, placeholder: '6XX XXXX XXXX' },
  { name: 'Sweden', nameAr: 'السويد', code: 'SE', dialCode: '+46', flagUrl: getFlagUrl('SE'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: '7X XXX XX XX' },
  { name: 'Norway', nameAr: 'النرويج', code: 'NO', dialCode: '+47', flagUrl: getFlagUrl('NO'), phoneValidation: { minLength: 8, maxLength: 8 }, placeholder: 'XXX XX XXX' },
  { name: 'Denmark', nameAr: 'الدنمارك', code: 'DK', dialCode: '+45', flagUrl: getFlagUrl('DK'), phoneValidation: { minLength: 8, maxLength: 8 }, placeholder: 'XX XX XX XX' },
  { name: 'Finland', nameAr: 'فنلندا', code: 'FI', dialCode: '+358', flagUrl: getFlagUrl('FI'), phoneValidation: { minLength: 9, maxLength: 10 }, placeholder: 'XX XXX XXXX' },
  { name: 'Poland', nameAr: 'بولندا', code: 'PL', dialCode: '+48', flagUrl: getFlagUrl('PL'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: 'XXX XXX XXX' },
  { name: 'Portugal', nameAr: 'البرتغال', code: 'PT', dialCode: '+351', flagUrl: getFlagUrl('PT'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: '9XX XXX XXX' },
  { name: 'Greece', nameAr: 'اليونان', code: 'GR', dialCode: '+30', flagUrl: getFlagUrl('GR'), phoneValidation: { minLength: 10, maxLength: 10 }, placeholder: '6XX XXX XXXX' },
  { name: 'Turkey', nameAr: 'تركيا', code: 'TR', dialCode: '+90', flagUrl: getFlagUrl('TR'), phoneValidation: { minLength: 10, maxLength: 10 }, placeholder: '5XX XXX XXXX' },
  { name: 'Russia', nameAr: 'روسيا', code: 'RU', dialCode: '+7', flagUrl: getFlagUrl('RU'), phoneValidation: { minLength: 10, maxLength: 10 }, placeholder: '9XX XXX-XX-XX' },
  { name: 'China', nameAr: 'الصين', code: 'CN', dialCode: '+86', flagUrl: getFlagUrl('CN'), phoneValidation: { minLength: 11, maxLength: 11 }, placeholder: '1XX XXXX XXXX' },
  { name: 'Japan', nameAr: 'اليابان', code: 'JP', dialCode: '+81', flagUrl: getFlagUrl('JP'), phoneValidation: { minLength: 10, maxLength: 10 }, placeholder: '90-XXXX-XXXX' },
  { name: 'South Korea', nameAr: 'كوريا الجنوبية', code: 'KR', dialCode: '+82', flagUrl: getFlagUrl('KR'), phoneValidation: { minLength: 9, maxLength: 10 }, placeholder: '10-XXXX-XXXX' },
  { name: 'India', nameAr: 'الهند', code: 'IN', dialCode: '+91', flagUrl: getFlagUrl('IN'), phoneValidation: { minLength: 10, maxLength: 10 }, placeholder: '9XXXX XXXXX' },
  { name: 'Pakistan', nameAr: 'باكستان', code: 'PK', dialCode: '+92', flagUrl: getFlagUrl('PK'), phoneValidation: { minLength: 10, maxLength: 10 }, placeholder: '3XX-XXXXXXX' },
  { name: 'Bangladesh', nameAr: 'بنغلاديش', code: 'BD', dialCode: '+880', flagUrl: getFlagUrl('BD'), phoneValidation: { minLength: 10, maxLength: 10 }, placeholder: '1XXX-XXXXXX' },
  { name: 'Indonesia', nameAr: 'إندونيسيا', code: 'ID', dialCode: '+62', flagUrl: getFlagUrl('ID'), phoneValidation: { minLength: 9, maxLength: 11 }, placeholder: '8XX-XXXX-XXXX' },
  { name: 'Malaysia', nameAr: 'ماليزيا', code: 'MY', dialCode: '+60', flagUrl: getFlagUrl('MY'), phoneValidation: { minLength: 9, maxLength: 10 }, placeholder: '1X-XXX XXXX' },
  { name: 'Singapore', nameAr: 'سنغافورة', code: 'SG', dialCode: '+65', flagUrl: getFlagUrl('SG'), phoneValidation: { minLength: 8, maxLength: 8 }, placeholder: 'XXXX XXXX' },
  { name: 'Philippines', nameAr: 'الفلبين', code: 'PH', dialCode: '+63', flagUrl: getFlagUrl('PH'), phoneValidation: { minLength: 10, maxLength: 10 }, placeholder: '9XX XXX XXXX' },
  { name: 'Thailand', nameAr: 'تايلاند', code: 'TH', dialCode: '+66', flagUrl: getFlagUrl('TH'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: '8X-XXX-XXXX' },
  { name: 'Vietnam', nameAr: 'فيتنام', code: 'VN', dialCode: '+84', flagUrl: getFlagUrl('VN'), phoneValidation: { minLength: 9, maxLength: 10 }, placeholder: '9X XXXX XXXX' },
  { name: 'Australia', nameAr: 'أستراليا', code: 'AU', dialCode: '+61', flagUrl: getFlagUrl('AU'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: '4XX XXX XXX' },
  { name: 'New Zealand', nameAr: 'نيوزيلندا', code: 'NZ', dialCode: '+64', flagUrl: getFlagUrl('NZ'), phoneValidation: { minLength: 8, maxLength: 10 }, placeholder: '2X XXX XXXX' },
  { name: 'Canada', nameAr: 'كندا', code: 'CA', dialCode: '+1', flagUrl: getFlagUrl('CA'), phoneValidation: { minLength: 10, maxLength: 10 }, placeholder: '(XXX) XXX-XXXX' },
  { name: 'Mexico', nameAr: 'المكسيك', code: 'MX', dialCode: '+52', flagUrl: getFlagUrl('MX'), phoneValidation: { minLength: 10, maxLength: 10 }, placeholder: 'XX XXXX XXXX' },
  { name: 'Brazil', nameAr: 'البرازيل', code: 'BR', dialCode: '+55', flagUrl: getFlagUrl('BR'), phoneValidation: { minLength: 10, maxLength: 11 }, placeholder: '(XX) XXXXX-XXXX' },
  { name: 'Argentina', nameAr: 'الأرجنتين', code: 'AR', dialCode: '+54', flagUrl: getFlagUrl('AR'), phoneValidation: { minLength: 10, maxLength: 10 }, placeholder: '11 XXXX-XXXX' },
  { name: 'South Africa', nameAr: 'جنوب أفريقيا', code: 'ZA', dialCode: '+27', flagUrl: getFlagUrl('ZA'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: 'XX XXX XXXX' },
  { name: 'Nigeria', nameAr: 'نيجيريا', code: 'NG', dialCode: '+234', flagUrl: getFlagUrl('NG'), phoneValidation: { minLength: 10, maxLength: 10 }, placeholder: '8XX XXX XXXX' },
  { name: 'Kenya', nameAr: 'كينيا', code: 'KE', dialCode: '+254', flagUrl: getFlagUrl('KE'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: '7XX XXX XXX' },
  { name: 'Iran', nameAr: 'إيران', code: 'IR', dialCode: '+98', flagUrl: getFlagUrl('IR'), phoneValidation: { minLength: 10, maxLength: 10 }, placeholder: '9XX XXX XXXX' },
  { name: 'Afghanistan', nameAr: 'أفغانستان', code: 'AF', dialCode: '+93', flagUrl: getFlagUrl('AF'), phoneValidation: { minLength: 9, maxLength: 9 }, placeholder: '7XX XXX XXX' },
];
