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