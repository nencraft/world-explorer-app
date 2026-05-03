import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface WorldBankValue {
  id: string;
  iso2code: string;
  value: string;
}

export interface CountryInfo {
  id: string;
  iso2Code: string;
  name: string;
  region: WorldBankValue;
  adminregion: WorldBankValue;
  incomeLevel: WorldBankValue;
  lendingType: WorldBankValue;
  capitalCity: string;
  longitude: string;
  latitude: string;
}

interface WorldBankApiMetadata {
  page: number;
  pages: number;
  per_page: string;
  total: number;
}

type WorldBankApiResponse = [WorldBankApiMetadata, CountryInfo[]?];

@Injectable({
  providedIn: 'root'
})
export class WorldBankService {
  private readonly apiUrl = 'https://api.worldbank.org/v2/country/';

  constructor(private http: HttpClient) {}

  getCountryInfo(code: string): Observable<CountryInfo | null> {
    const countryCode = code.trim().toLowerCase();

    return this.http
      .get<WorldBankApiResponse>(`${this.apiUrl}${countryCode}?format=json`)
      .pipe(map((response) => response[1]?.[0] ?? null));
  }
}