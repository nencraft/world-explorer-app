import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecentCountriesService {
  private readonly storageKey = 'world-explorer-recent-countries';
  private readonly maxItems = 6;

  getRecentCountryCodes(): string[] {
    return this.readCodes();
  }

  addCountry(code: string): string[] {
    const normalizedCode = code.toUpperCase();
    const nextCodes = [
      normalizedCode,
      ...this.readCodes().filter((savedCode) => savedCode !== normalizedCode)
    ].slice(0, this.maxItems);

    localStorage.setItem(this.storageKey, JSON.stringify(nextCodes));

    return nextCodes;
  }

  clear(): string[] {
    localStorage.removeItem(this.storageKey);
    return [];
  }

  private readCodes(): string[] {
    try {
      const value = localStorage.getItem(this.storageKey);
      const parsed = value ? JSON.parse(value) : [];

      return Array.isArray(parsed)
        ? parsed.filter((code): code is string => typeof code === 'string')
        : [];
    } catch {
      return [];
    }
  }
}