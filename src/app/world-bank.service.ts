import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, shareReplay } from 'rxjs';
import { INDICATORS } from './data/indicator-config';
import { CountryInfo, WorldBankValue } from './models/country.model';
import { CountryDashboard, IndicatorConfig, IndicatorValue } from './models/indicator.model';

export type { CountryInfo, WorldBankValue } from './models/country.model';
export type { CountryDashboard, IndicatorValue } from './models/indicator.model';

interface WorldBankApiMetadata {
  page: number;
  pages: number;
  per_page: string;
  total: number;
}

type WorldBankCountryResponse = [WorldBankApiMetadata, CountryInfo[]?];

interface WorldBankIndicatorRecord {
  indicator: {
    id: string;
    value: string;
  };
  country: {
    id: string;
    value: string;
  };
  countryiso3code: string;
  date: string;
  value: number | null;
  unit: string;
  obs_status: string;
  decimal: number;
}

type WorldBankIndicatorResponse = [WorldBankApiMetadata, WorldBankIndicatorRecord[]?];

@Injectable({
  providedIn: 'root'
})
export class WorldBankService {
  private readonly countryApiUrl = 'https://api.worldbank.org/v2/country';
  private readonly dashboardCache = new Map<string, Observable<CountryDashboard | null>>();

  constructor(private http: HttpClient) {}

  getCountryInfo(code: string): Observable<CountryInfo | null> {
    const countryCode = this.normalizeCode(code);

    return this.http
      .get<WorldBankCountryResponse>(`${this.countryApiUrl}/${countryCode}?format=json`)
      .pipe(map((response) => response[1]?.[0] ?? null));
  }

  getCountryDashboard(code: string): Observable<CountryDashboard | null> {
    const countryCode = this.normalizeCode(code);
    const cachedDashboard = this.dashboardCache.get(countryCode);

    if (cachedDashboard) {
      return cachedDashboard;
    }

    const dashboard$ = forkJoin({
      country: this.getCountryInfo(countryCode),
      indicators: forkJoin(INDICATORS.map((indicator) => this.getLatestIndicator(countryCode, indicator)))
    }).pipe(
      map(({ country, indicators }) => (country ? { country, indicators } : null)),
      catchError(() => of(null)),
      shareReplay(1)
    );

    this.dashboardCache.set(countryCode, dashboard$);

    return dashboard$;
  }

  clearCache(): void {
    this.dashboardCache.clear();
  }

  private getLatestIndicator(code: string, indicator: IndicatorConfig): Observable<IndicatorValue> {
    const countryCode = this.normalizeCode(code);
    const url = `${this.countryApiUrl}/${countryCode}/indicator/${indicator.id}?format=json&per_page=60`;

    return this.http.get<WorldBankIndicatorResponse>(url).pipe(
      map((response) => this.mapIndicatorResponse(response, indicator)),
      catchError(() => of(this.emptyIndicator(indicator)))
    );
  }

  private mapIndicatorResponse(
    response: WorldBankIndicatorResponse,
    indicator: IndicatorConfig
  ): IndicatorValue {
    const record = response[1]?.find((entry) => entry.value !== null);

    if (!record) {
      return this.emptyIndicator(indicator);
    }

    return {
      id: indicator.id,
      label: indicator.label,
      shortLabel: indicator.shortLabel,
      unit: indicator.unit,
      format: indicator.format,
      value: record.value,
      year: record.date
    };
  }

  private emptyIndicator(indicator: IndicatorConfig): IndicatorValue {
    return {
      id: indicator.id,
      label: indicator.label,
      shortLabel: indicator.shortLabel,
      unit: indicator.unit,
      format: indicator.format,
      value: null,
      year: null
    };
  }

  private normalizeCode(code: string): string {
    return code.trim().toLowerCase();
  }
}