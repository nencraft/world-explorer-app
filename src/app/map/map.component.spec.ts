import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { MapComponent } from './map.component';
import { CountryDashboard } from '../models/indicator.model';
import { RecentCountriesService } from '../services/recent-countries.service';
import { WorldBankService } from '../world-bank.service';

const mockDashboard: CountryDashboard = {
  country: {
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
  },
  indicators: [
    {
      id: 'SP.POP.TOTL',
      label: 'Population',
      shortLabel: 'Population',
      format: 'number',
      value: 331002651,
      year: '2023'
    }
  ]
};

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let worldBankServiceSpy: jasmine.SpyObj<WorldBankService>;
  let recentCountriesServiceSpy: jasmine.SpyObj<RecentCountriesService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let paramMapSubject: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  beforeEach(async () => {
    paramMapSubject = new BehaviorSubject(convertToParamMap({}));
    worldBankServiceSpy = jasmine.createSpyObj('WorldBankService', ['getCountryDashboard']);
    recentCountriesServiceSpy = jasmine.createSpyObj('RecentCountriesService', [
      'getRecentCountryCodes',
      'addCountry',
      'clear'
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    worldBankServiceSpy.getCountryDashboard.and.returnValue(of(mockDashboard));
    recentCountriesServiceSpy.getRecentCountryCodes.and.returnValue([]);
    recentCountriesServiceSpy.addCountry.and.returnValue(['US']);

    await TestBed.configureTestingModule({
      imports: [MapComponent],
      providers: [
        { provide: WorldBankService, useValue: worldBankServiceSpy },
        { provide: RecentCountriesService, useValue: recentCountriesServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { paramMap: paramMapSubject.asObservable() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the selected country route', () => {
    component.onCountrySelected('us');

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/map', 'US']);
  });

  it('should load country dashboard data from the route parameter', () => {
    paramMapSubject.next(convertToParamMap({ code: 'US' }));

    expect(worldBankServiceSpy.getCountryDashboard).toHaveBeenCalledWith('US');
    expect(component.selectedCountry?.name).toBe('United States');
    expect(component.selectedCountryCode).toBe('US');
    expect(component.isLoading).toBeFalse();
  });

  it('should filter countries by search term', () => {
    component.searchTerm = 'can';

    expect(component.filteredCountries[0].name).toBe('Canada');
  });

  it('should load a comparison country', () => {
    component.selectedCountryCode = 'US';

    component.selectComparisonCountry({ name: 'Canada', code: 'CA' });

    expect(worldBankServiceSpy.getCountryDashboard).toHaveBeenCalledWith('CA');
    expect(component.compareDashboard?.country.name).toBe('United States');
    expect(component.isCompareLoading).toBeFalse();
  });

  it('should show an error message when dashboard data fails to load', () => {
    worldBankServiceSpy.getCountryDashboard.and.returnValue(throwError(() => new Error('API unavailable')));

    paramMapSubject.next(convertToParamMap({ code: 'US' }));

    expect(component.selectedCountry).toBeNull();
    expect(component.errorMessage).toBe('Country details could not be loaded. Please try another country.');
    expect(component.isLoading).toBeFalse();
  });

  it('should clear selection when the route has no country code', () => {
    paramMapSubject.next(convertToParamMap({ code: 'US' }));
    paramMapSubject.next(convertToParamMap({}));

    expect(component.selectedCountry).toBeNull();
    expect(component.selectedCountryCode).toBeNull();
    expect(component.errorMessage).toBe('');
  });
});