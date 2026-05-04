import { TestBed } from '@angular/core/testing';
import { RecentCountriesService } from './recent-countries.service';

describe('RecentCountriesService', () => {
  let service: RecentCountriesService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(RecentCountriesService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should store recently selected country codes', () => {
    expect(service.addCountry('US')).toEqual(['US']);
    expect(service.addCountry('CA')).toEqual(['CA', 'US']);
  });

  it('should move an existing country code to the front', () => {
    service.addCountry('US');
    service.addCountry('CA');

    expect(service.addCountry('US')).toEqual(['US', 'CA']);
  });

  it('should limit recent countries to six items', () => {
    ['US', 'CA', 'JP', 'BR', 'MX', 'FR', 'DE'].forEach((code) => service.addCountry(code));

    expect(service.getRecentCountryCodes()).toEqual(['DE', 'FR', 'MX', 'BR', 'JP', 'CA']);
  });

  it('should clear recent country codes', () => {
    service.addCountry('US');

    expect(service.clear()).toEqual([]);
    expect(service.getRecentCountryCodes()).toEqual([]);
  });
});