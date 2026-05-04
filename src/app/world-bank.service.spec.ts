import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { WorldBankService } from './world-bank.service';

describe('WorldBankService', () => {
  let service: WorldBankService;
  let httpMock: HttpTestingController;

  const countryResponse = [
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
  ];

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
    request.flush(countryResponse);
  });

  it('should return null when the API has no country record', () => {
    service.getCountryInfo('ZZ').subscribe((country) => {
      expect(country).toBeNull();
    });

    const request = httpMock.expectOne('https://api.worldbank.org/v2/country/zz?format=json');
    request.flush([{ page: 1, pages: 1, per_page: '50', total: 0 }, []]);
  });

  it('should build a dashboard from country metadata and indicators', () => {
    service.getCountryDashboard('US').subscribe((dashboard) => {
      expect(dashboard?.country.name).toBe('United States');
      expect(dashboard?.indicators.length).toBe(5);
      expect(dashboard?.indicators[0].value).toBe(331002651);
      expect(dashboard?.indicators[0].year).toBe('2023');
    });

    httpMock.expectOne('https://api.worldbank.org/v2/country/us?format=json').flush(countryResponse);

    const indicatorRequests = httpMock.match((request) =>
      request.urlWithParams.startsWith('https://api.worldbank.org/v2/country/us/indicator/')
    );

    expect(indicatorRequests.length).toBe(5);

    indicatorRequests.forEach((request, index) => {
      request.flush([
        { page: 1, pages: 1, per_page: '60', total: 1 },
        [
          {
            indicator: { id: 'mock', value: 'Mock indicator' },
            country: { id: 'US', value: 'United States' },
            countryiso3code: 'USA',
            date: '2023',
            value: index === 0 ? 331002651 : 1000 + index,
            unit: '',
            obs_status: '',
            decimal: 0
          }
        ]
      ]);
    });
  });

  it('should cache dashboard requests for the same country code', () => {
    service.getCountryDashboard('US').subscribe();
    httpMock.expectOne('https://api.worldbank.org/v2/country/us?format=json').flush(countryResponse);

    httpMock.match((request) =>
      request.urlWithParams.startsWith('https://api.worldbank.org/v2/country/us/indicator/')
    ).forEach((request) => {
      request.flush([
        { page: 1, pages: 1, per_page: '60', total: 1 },
        [
          {
            indicator: { id: 'mock', value: 'Mock indicator' },
            country: { id: 'US', value: 'United States' },
            countryiso3code: 'USA',
            date: '2023',
            value: 1,
            unit: '',
            obs_status: '',
            decimal: 0
          }
        ]
      ]);
    });

    service.getCountryDashboard('US').subscribe();

    httpMock.expectNone('https://api.worldbank.org/v2/country/us?format=json');
  });
});