import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { WorldBankService } from './world-bank.service';

describe('WorldBankService', () => {
  let service: WorldBankService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(WorldBankService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should map a World Bank API response to a country profile', () => {
    service.getCountryInfo('US').subscribe((country) => {
      expect(country?.name).toBe('United States');
      expect(country?.capitalCity).toBe('Washington D.C.');
    });

    const request = httpMock.expectOne('https://api.worldbank.org/v2/country/us?format=json');

    expect(request.request.method).toBe('GET');

    request.flush([
      { page: 1, pages: 1, per_page: '50', total: 1 },
      [
        {
          id: 'USA',
          iso2Code: 'US',
          name: 'United States',
          region: { id: 'NAC', iso2code: 'XU', value: 'North America' },
          adminregion: { id: '', iso2code: '', value: '' },
          incomeLevel: { id: 'HIC', iso2code: 'XD', value: 'High income' },
          lendingType: { id: 'LNX', iso2code: 'XX', value: 'Not classified' },
          capitalCity: 'Washington D.C.',
          longitude: '-77.032',
          latitude: '38.8895'
        }
      ]
    ]);
  });

  it('should return null when the API has no country record', () => {
    service.getCountryInfo('ZZ').subscribe((country) => {
      expect(country).toBeNull();
    });

    const request = httpMock.expectOne('https://api.worldbank.org/v2/country/zz?format=json');
    request.flush([{ page: 1, pages: 1, per_page: '50', total: 0 }, []]);
  });
});