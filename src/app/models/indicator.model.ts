import { CountryInfo } from './country.model';

export interface IndicatorConfig {
  id: string;
  label: string;
  shortLabel: string;
  unit?: string;
  format: 'number' | 'currency' | 'percent' | 'years';
}

export interface IndicatorValue {
  id: string;
  label: string;
  shortLabel: string;
  unit?: string;
  format: IndicatorConfig['format'];
  value: number | null;
  year: string | null;
}

export interface CountryDashboard {
  country: CountryInfo;
  indicators: IndicatorValue[];
}