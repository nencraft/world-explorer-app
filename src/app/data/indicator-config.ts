import { IndicatorConfig } from '../models/indicator.model';

export const INDICATORS: IndicatorConfig[] = [
  {
    id: 'SP.POP.TOTL',
    label: 'Population',
    shortLabel: 'Population',
    format: 'number'
  },
  {
    id: 'NY.GDP.MKTP.CD',
    label: 'Gross domestic product',
    shortLabel: 'GDP',
    unit: 'USD',
    format: 'currency'
  },
  {
    id: 'NY.GDP.PCAP.CD',
    label: 'GDP per capita',
    shortLabel: 'GDP / person',
    unit: 'USD',
    format: 'currency'
  },
  {
    id: 'SP.DYN.LE00.IN',
    label: 'Life expectancy',
    shortLabel: 'Life expectancy',
    unit: 'years',
    format: 'years'
  },
  {
    id: 'IT.NET.USER.ZS',
    label: 'Individuals using the Internet',
    shortLabel: 'Internet users',
    unit: '% of population',
    format: 'percent'
  }
];