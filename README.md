# World Explorer

World Explorer is an Angular application for exploring country-level data through an interactive SVG world map. Select a country on the map to load details from the World Bank Countries API, including region, income level, capital city, and coordinates.

## Features

- Interactive SVG world map
- Live country data from the World Bank API
- Country detail panel with loading, empty, and error states
- Responsive layout for desktop and smaller screens
- Typed API service using TypeScript interfaces
- Unit tests for service and component behavior

## Tech Stack

- Angular 17
- TypeScript
- RxJS
- World Bank Countries API
- HTML/CSS
- Jasmine/Karma

## Getting Started

### Prerequisites

Install Node.js and npm.

Check that they are installed:

```bash
node --version
npm --version
```

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Run Locally

Start the development server:

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

Runs the Angular development server.

```bash
npm run build
```

Builds the application for production.

```bash
npm test
```

Runs the unit test suite.

## Project Structure

```text
src/
  app/
    map/
      map.component.ts
      map.component.html
      map.component.css
      map.component.spec.ts
    world-bank.service.ts
    world-bank.service.spec.ts
    app.component.ts
  assets/
    world.svg
```

## API

This project uses the World Bank Countries API:

```text
https://api.worldbank.org/v2/country/{countryCode}?format=json
```

The API response is mapped into a typed `CountryInfo` model before being used by the map component.

## Main Components

### MapComponent

Handles user interaction with the SVG map, selected-country state, loading state, error handling, and rendering the country detail panel.

### WorldBankService

Handles requests to the World Bank API and maps the API response into a single country profile.

## Testing

Run the test suite with:

```bash
npm test -- --watch=false
```

The tests cover:

- App creation
- World Bank API response mapping
- Empty API responses
- Country selection behavior
- Error handling
- Clearing selected country state
