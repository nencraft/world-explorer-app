import { IndicatorValue } from '../models/indicator.model';

export function formatIndicatorValue(indicator: IndicatorValue): string {
  if (indicator.value === null) {
    return 'No data';
  }

  switch (indicator.format) {
    case 'currency':
      return formatCurrency(indicator.value);
    case 'percent':
      return `${formatCompactNumber(indicator.value)}%`;
    case 'years':
      return `${indicator.value.toFixed(1)} years`;
    case 'number':
    default:
      return formatCompactNumber(indicator.value);
  }
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);
}

export function getComparisonPercent(value: number | null, baseline: number | null): number {
  if (value === null || baseline === null || baseline <= 0) {
    return 0;
  }

  return Math.min(Math.round((value / baseline) * 100), 100);
}