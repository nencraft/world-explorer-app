# World Explorer

World Explorer is an Angular application for exploring country-level World Bank data through an interactive SVG world map. Users can select a country from the map, search by country name, open country-specific routes, view economic and demographic indicators, compare two countries, and revisit recently selected countries.

## Features

- Interactive SVG world map
- Country search with typeahead results
- Route-based country pages such as `/map/US`
- Live country metadata from the World Bank Countries API
- Indicator dashboard for population, GDP, GDP per capita, life expectancy, and internet usage
- Side-by-side country comparison
- Recently viewed countries stored in local browser storage
- Loading, empty, and error states
- Typed API models and service-layer response mapping
- Cached dashboard requests using RxJS
- Unit tests for service, component, and local storage behavior

## Tech Stack

- Angular 17
- TypeScript
- RxJS
- Angular Router
- Angular Forms
- World Bank API
- Jasmine/Karma
- HTML/CSS

## Getting Started

### Prerequisites

Install Node.js and npm.

Check that both are available:

```bash
node --version
npm --version
```

### Installation

Install project dependencies:

```bash
npm install
```

### Run Locally

Start the Angular development server:

```bash
npm start
```

Open the app at:

```text
http://localhost:4200
```

## Available Scripts

```bash
npm start
```

Runs the local development server.

```bash
npm run build
```

Builds the app for production.

```bash
npm test
```

Runs the unit test suite.

## Project Structure

```text
src/
  app/
    data/
      indicator-config.ts
    map/
      map.component.ts
      map.component.html
      map.component.css
      map.component.spec.ts
    models/
      country.model.ts
      indicator.model.ts
    services/
      recent-countries.service.ts
      recent-countries.service.spec.ts
    utils/
      number-format.ts
    world-bank.service.ts
    world-bank.service.spec.ts
```

## API Usage

The app uses the World Bank Countries API.

Country metadata:

```text
https://api.worldbank.org/v2/country/{countryCode}?format=json
```

Indicator data:

```text
https://api.worldbank.org/v2/country/{countryCode}/indicator/{indicatorId}?format=json&per_page=60
```

The app currently displays these indicators:

| Indicator | World Bank ID |
| --- | --- |
| Population | `SP.POP.TOTL` |
| GDP | `NY.GDP.MKTP.CD` |
| GDP per capita | `NY.GDP.PCAP.CD` |
| Life expectancy | `SP.DYN.LE00.IN` |
| Internet users | `IT.NET.USER.ZS` |

## Architecture

The app separates API models, indicator configuration, data formatting, service logic, and UI state.

The World Bank service maps API responses into typed application models before the data reaches the component. Country dashboard requests are cached in the service layer with RxJS so revisiting a country does not create duplicate network requests.

## Data Flow

1. The user selects a country from the map, search results, recent list, or direct route.
2. The selected country code is synchronized with the Angular route.
3. The World Bank service requests country metadata and indicator data.
4. API responses are normalized into a `CountryDashboard` model.
5. The dashboard renders profile details, indicator cards, and optional comparison data.
6. Recently viewed countries are persisted in local storage.

## Testing

Run the test suite with:

```bash
npm test -- --watch=false
```

The tests cover:

- App creation
- World Bank country metadata mapping
- Indicator dashboard mapping
- Cached dashboard requests
- Recent country persistence
- Route-based country loading
- Search filtering
- Comparison loading
- API failure handling
