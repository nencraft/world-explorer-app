import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CountryInfo } from '../models/country.model';
import { CountryDashboard, IndicatorValue } from '../models/indicator.model';
import { RecentCountriesService } from '../services/recent-countries.service';
import { formatIndicatorValue, getComparisonPercent } from '../utils/number-format';
import { WorldBankService } from '../world-bank.service';

const COUNTRY_NAME_TO_CODE: { [key: string]: string } = {
  "Afghanistan": "AF",
  "Albania": "AL",
  "Algeria": "DZ",
  "Andorra": "AD",
  "Angola": "AO",
  "Anguilla": "AI",
  "Antigua and Barbuda": "AG",
  "Argentina": "AR",
  "Armenia": "AM",
  "Aruba": "AW",
  "Australia": "AU",
  "Austria": "AT",
  "Azerbaijan": "AZ",
  "Bahamas": "BS",
  "Bahrain": "BH",
  "Bangladesh": "BD",
  "Barbados": "BB",
  "Belarus": "BY",
  "Belgium": "BE",
  "Belize": "BZ",
  "Benin": "BJ",
  "Bermuda": "BM",
  "Bhutan": "BT",
  "Bolivia": "BO",
  "Bosnia and Herzegovina": "BA",
  "Botswana": "BW",
  "Brazil": "BR",
  "Brunei": "BN",
  "Bulgaria": "BG",
  "Burkina Faso": "BF",
  "Burundi": "BI",
  "Cabo Verde": "CV",
  "Cambodia": "KH",
  "Cameroon": "CM",
  "Canada": "CA",
  "Canary Islands (Spain)": "IC",
  "Central African Republic": "CF",
  "Chad": "TD",
  "Chile": "CL",
  "China": "CN",
  "Colombia": "CO",
  "Comoros": "KM",
  "Congo": "CG",
  "Congo (Democratic Republic)": "CD",
  "Costa Rica": "CR",
  "Croatia": "HR",
  "Cuba": "CU",
  "Curaçao": "CW",
  "Cyprus": "CY",
  "Czech Republic": "CZ",
  "Denmark": "DK",
  "Djibouti": "DJ",
  "Dominica": "DM",
  "Dominican Republic": "DO",
  "East Timor": "TL",
  "Ecuador": "EC",
  "Egypt": "EG",
  "El Salvador": "SV",
  "Equatorial Guinea": "GQ",
  "Eritrea": "ER",
  "Estonia": "EE",
  "Eswatini": "SZ",
  "Ethiopia": "ET",
  "Fiji": "FJ",
  "Finland": "FI",
  "France": "FR",
  "French Guiana": "GF",
  "Gabon": "GA",
  "Gambia": "GM",
  "Georgia": "GE",
  "Germany": "DE",
  "Ghana": "GH",
  "Greece": "GR",
  "Greenland": "GL",
  "Grenada": "GD",
  "Guadeloupe": "GP",
  "Guam": "GU",
  "Guatemala": "GT",
  "Guinea": "GN",
  "Guinea-Bissau": "GW",
  "Guyana": "GY",
  "Haiti": "HT",
  "Honduras": "HN",
  "Hong Kong": "HK",
  "Hungary": "HU",
  "Iceland": "IS",
  "India": "IN",
  "Indonesia": "ID",
  "Iran": "IR",
  "Iraq": "IQ",
  "Ireland": "IE",
  "Israel": "IL",
  "Italy": "IT",
  "Ivory Coast": "CI",
  "Jamaica": "JM",
  "Japan": "JP",
  "Jordan": "JO",
  "Kazakhstan": "KZ",
  "Kenya": "KE",
  "Kiribati": "KI",
  "Kuwait": "KW",
  "Kyrgyzstan": "KG",
  "Laos": "LA",
  "Latvia": "LV",
  "Lebanon": "LB",
  "Lesotho": "LS",
  "Liberia": "LR",
  "Libya": "LY",
  "Liechtenstein": "LI",
  "Lithuania": "LT",
  "Luxembourg": "LU",
  "Macau": "MO",
  "Madagascar": "MG",
  "Malawi": "MW",
  "Malaysia": "MY",
  "Maldives": "MV",
  "Mali": "ML",
  "Malta": "MT",
  "Marshall Islands": "MH",
  "Martinique": "MQ",
  "Mauritania": "MR",
  "Mauritius": "MU",
  "Mayotte": "YT",
  "Mexico": "MX",
  "Micronesia": "FM",
  "Moldova": "MD",
  "Monaco": "MC",
  "Mongolia": "MN",
  "Montenegro": "ME",
  "Montserrat": "MS",
  "Morocco": "MA",
  "Mozambique": "MZ",
  "Myanmar": "MM",
  "Namibia": "NA",
  "Nauru": "NR",
  "Nepal": "NP",
  "Netherlands": "NL",
  "New Caledonia": "NC",
  "New Zealand": "NZ",
  "Nicaragua": "NI",
  "Niger": "NE",
  "Nigeria": "NG",
  "Niue": "NU",
  "North Korea": "KP",
  "North Macedonia": "MK",
  "Northern Mariana Islands": "MP",
  "Norway": "NO",
  "Oman": "OM",
  "Pakistan": "PK",
  "Palau": "PW",
  "Palestinian Territories": "PS",
  "Panama": "PA",
  "Papua New Guinea": "PG",
  "Paraguay": "PY",
  "Peru": "PE",
  "Philippines": "PH",
  "Poland": "PL",
  "Portugal": "PT",
  "Puerto Rico": "PR",
  "Qatar": "QA",
  "Réunion": "RE",
  "Romania": "RO",
  "Russian Federation": "RU",
  "Rwanda": "RW",
  "Saint Kitts and Nevis": "KN",
  "Saint Lucia": "LC",
  "Saint Vincent and the Grenadines": "VC",
  "Samoa": "WS",
  "San Marino": "SM",
  "Saudi Arabia": "SA",
  "Senegal": "SN",
  "Serbia": "RS",
  "Seychelles": "SC",
  "Sierra Leone": "SL",
  "Singapore": "SG",
  "Sint Maarten": "SX",
  "Slovakia": "SK",
  "Slovenia": "SI",
  "Solomon Islands": "SB",
  "Somalia": "SO",
  "South Africa": "ZA",
  "South Korea": "KR",
  "South Sudan": "SS",
  "Spain": "ES",
  "Sri Lanka": "LK",
  "Sudan": "SD",
  "Suriname": "SR",
  "Sweden": "SE",
  "Switzerland": "CH",
  "Syria": "SY",
  "São Tomé and Principe": "ST",
  "Taiwan": "TW",
  "Tajikistan": "TJ",
  "Tanzania": "TZ",
  "Thailand": "TH",
  "Togo": "TG",
  "Tonga": "TO",
  "Trinidad and Tobago": "TT",
  "Tunisia": "TN",
  "Turkey": "TR",
  "Turkmenistan": "TM",
  "Turks and Caicos Islands": "TC",
  "Tuvalu": "TV",
  "Uganda": "UG",
  "Ukraine": "UA",
  "United Arab Emirates": "AE",
  "United Kingdom": "GB",
  "United States": "US",
  "United States Virgin Islands": "VI",
  "Uruguay": "UY",
  "Uzbekistan": "UZ",
  "Vanuatu": "VU",
  "Vatican City": "VA",
  "Venezuela": "VE",
  "Vietnam": "VN",
  "Wallis and Futuna": "WF",
  "Western Sahara": "EH",
  "Yemen": "YE",
  "Zambia": "ZM",
  "Zimbabwe": "ZW"
};

interface CountryOption {
  name: string;
  code: string;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, OnDestroy {
  readonly countryOptions: CountryOption[] = Object.entries(COUNTRY_NAME_TO_CODE)
    .map(([name, code]) => ({ name, code }))
    .sort((a, b) => a.name.localeCompare(b.name));

  selectedDashboard: CountryDashboard | null = null;
  selectedCountry: CountryInfo | null = null;
  selectedCountryCode: string | null = null;

  compareDashboard: CountryDashboard | null = null;
  compareCode = '';
  compareErrorMessage = '';
  isCompareLoading = false;

  recentCountries: CountryOption[] = [];
  searchTerm = '';
  comparisonSearchTerm = '';
  isLoading = false;
  errorMessage = '';

  private readonly destroy$ = new Subject<void>();
  private selectedPath: SVGElement | null = null;

  constructor(
    private worldBankService: WorldBankService,
    private recentCountriesService: RecentCountriesService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recentCountries = this.toCountryOptions(this.recentCountriesService.getRecentCountryCodes());

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const code = params.get('code');

      if (code) {
        this.loadCountry(code);
      } else {
        this.clearSelectionState();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get filteredCountries(): CountryOption[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return [];
    }

    return this.countryOptions
      .filter((country) => {
        return (
          country.name.toLowerCase().includes(term) ||
          country.code.toLowerCase().includes(term)
        );
      })
      .slice(0, 8);
  }

  get comparisonOptions(): CountryOption[] {
    const term = this.comparisonSearchTerm.trim().toLowerCase();

    if (!term) {
      return this.countryOptions
        .filter((country) => country.code !== this.selectedCountryCode)
        .slice(0, 8);
    }

    return this.countryOptions
      .filter((country) => {
        return (
          country.code !== this.selectedCountryCode &&
          (country.name.toLowerCase().includes(term) || country.code.toLowerCase().includes(term))
        );
      })
      .slice(0, 8);
  }

  onCountrySelected(code: string, path?: SVGElement): void {
    const countryCode = code.toUpperCase();

    if (path) {
      this.updateSelectedPath(path);
    }

    this.router.navigate(['/map', countryCode]);
  }

  selectSearchResult(country: CountryOption): void {
    this.searchTerm = country.name;
    this.onCountrySelected(country.code);
  }

  selectComparisonCountry(country: CountryOption): void {
    this.comparisonSearchTerm = country.name;
    this.compareCode = country.code;
    this.loadComparisonCountry(country.code);
  }

  clearComparison(): void {
    this.compareCode = '';
    this.comparisonSearchTerm = '';
    this.compareDashboard = null;
    this.compareErrorMessage = '';
    this.isCompareLoading = false;
  }

  handleSvgClick(event: MouseEvent): void {
    const target = event.target as SVGElement;

    if (target.tagName.toLowerCase() !== 'path') {
      return;
    }

    const code = this.getCountryCode(target);

    if (code) {
      this.onCountrySelected(code, target);
    }
  }

  clearSelection(): void {
    this.router.navigate(['/map']);
  }

  formatIndicator(indicator: IndicatorValue): string {
    return formatIndicatorValue(indicator);
  }

  getComparisonIndicator(indicatorId: string): IndicatorValue | null {
    return this.compareDashboard?.indicators.find((indicator) => indicator.id === indicatorId) ?? null;
  }

  getIndicatorBarWidth(indicator: IndicatorValue, dashboard: CountryDashboard | null): number {
    const comparisonIndicator = dashboard?.indicators.find((item) => item.id === indicator.id) ?? null;
    const selectedValue = indicator.value;
    const comparisonValue = comparisonIndicator?.value ?? null;
    const maxValue = Math.max(selectedValue ?? 0, comparisonValue ?? 0);

    return getComparisonPercent(indicator.value, maxValue);
  }

  private loadCountry(code: string): void {
    const countryCode = code.toUpperCase();

    this.isLoading = true;
    this.errorMessage = '';
    this.selectedCountryCode = countryCode;
    this.highlightCountryByCode(countryCode);

    this.worldBankService
      .getCountryDashboard(countryCode)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (dashboard) => {
          this.isLoading = false;
          this.selectedDashboard = dashboard;
          this.selectedCountry = dashboard?.country ?? null;

          if (!dashboard) {
            this.errorMessage = 'No World Bank profile was found for this map region.';
            return;
          }

          this.searchTerm = dashboard.country.name;
          this.recentCountries = this.toCountryOptions(this.recentCountriesService.addCountry(countryCode));

          if (this.compareCode === countryCode) {
            this.clearComparison();
          }
        },
        error: () => {
          this.isLoading = false;
          this.selectedDashboard = null;
          this.selectedCountry = null;
          this.errorMessage = 'Country details could not be loaded. Please try another country.';
        }
      });
  }

  private loadComparisonCountry(code: string): void {
    const countryCode = code.toUpperCase();

    if (!this.selectedCountryCode || countryCode === this.selectedCountryCode) {
      return;
    }

    this.isCompareLoading = true;
    this.compareErrorMessage = '';
    this.compareDashboard = null;

    this.worldBankService
      .getCountryDashboard(countryCode)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (dashboard) => {
          this.isCompareLoading = false;
          this.compareDashboard = dashboard;

          if (!dashboard) {
            this.compareErrorMessage = 'Comparison data is unavailable for that country.';
          }
        },
        error: () => {
          this.isCompareLoading = false;
          this.compareDashboard = null;
          this.compareErrorMessage = 'Comparison data could not be loaded.';
        }
      });
  }

  private clearSelectionState(): void {
    this.selectedDashboard = null;
    this.selectedCountry = null;
    this.selectedCountryCode = null;
    this.searchTerm = '';
    this.errorMessage = '';
    this.isLoading = false;
    this.clearComparison();

    if (this.selectedPath) {
      this.renderer.removeClass(this.selectedPath, 'country-path--selected');
      this.selectedPath = null;
    }
  }

  private getCountryCode(target: SVGElement): string | null {
    const id = target.getAttribute('id');

    if (id && id.length === 2) {
      return id.toUpperCase();
    }

    const name = target.getAttribute('name');

    if (name && COUNTRY_NAME_TO_CODE[name]) {
      return COUNTRY_NAME_TO_CODE[name];
    }

    const className = target
      .getAttribute('class')
      ?.replace(/\bcountry-path--selected\b/g, '')
      .trim();

    if (className && COUNTRY_NAME_TO_CODE[className]) {
      return COUNTRY_NAME_TO_CODE[className];
    }

    return null;
  }

  private highlightCountryByCode(code: string): void {
    setTimeout(() => {
      const paths = Array.from(document.querySelectorAll<SVGElement>('.world-map path'));
      const matchingPath = paths.find((path) => this.getCountryCode(path) === code.toUpperCase());

      if (matchingPath) {
        this.updateSelectedPath(matchingPath);
      }
    });
  }

  private updateSelectedPath(path: SVGElement): void {
    if (this.selectedPath) {
      this.renderer.removeClass(this.selectedPath, 'country-path--selected');
    }

    this.selectedPath = path;
    this.renderer.addClass(path, 'country-path--selected');
  }

  private toCountryOptions(codes: string[]): CountryOption[] {
    return codes
      .map((code) => this.countryOptions.find((country) => country.code === code))
      .filter((country): country is CountryOption => Boolean(country));
  }
}