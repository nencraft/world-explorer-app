import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MapComponent } from './map.component';
import { CountryInfo, WorldBankService } from '../world-bank.service';

const mockCountry: CountryInfo = {
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
};

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let worldBankServiceSpy: jasmine.SpyObj<WorldBankService>;

  beforeEach(async () => {
    worldBankServiceSpy = jasmine.createSpyObj('WorldBankService', ['getCountryInfo']);
    worldBankServiceSpy.getCountryInfo.and.returnValue(of(mockCountry));

    await TestBed.configureTestingModule({
      imports: [MapComponent],
      providers: [{ provide: WorldBankService, useValue: worldBankServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load country details when a country is selected', () => {
    component.onCountrySelected('US');

    expect(worldBankServiceSpy.getCountryInfo).toHaveBeenCalledWith('US');
    expect(component.selectedCountry).toEqual(mockCountry);
    expect(component.selectedCountryCode).toBe('US');
    expect(component.isLoading).toBeFalse();
  });

  it('should show an error message when country details fail to load', () => {
    worldBankServiceSpy.getCountryInfo.and.returnValue(throwError(() => new Error('API unavailable')));

    component.onCountrySelected('US');

    expect(component.selectedCountry).toBeNull();
    expect(component.errorMessage).toBe('Country details could not be loaded. Please try another country.');
    expect(component.isLoading).toBeFalse();
  });

  it('should clear the selected country', () => {
    component.onCountrySelected('US');
    component.clearSelection();

    expect(component.selectedCountry).toBeNull();
    expect(component.selectedCountryCode).toBeNull();
    expect(component.errorMessage).toBe('');
  });
});