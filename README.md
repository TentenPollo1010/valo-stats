# ValoStats

A modern, responsive web application for browsing Valorant competitive player statistics across multiple regions. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Multi-Region Support**: Browse player stats for NA, EU, APAC, Korea, China, Japan, Brazil, LATAM, Oceania, MENA, and Game Changers regions
- **Advanced Sorting**: Click column headers to sort players by rating, ACS, K/D ratio, and more
- **Search Functionality**: Quickly filter players by name
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode**: Toggle between light and dark themes
- **Detailed Stats**: View combat scores, K/D ratios, headshot percentages, clutch success rates, and more
- **Pagination**: Navigate through large player lists with ease

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom dark mode
- **Routing**: React Router DOM
- **Code Quality**: ESLint with TypeScript support
- **Type Safety**: Full TypeScript strict mode enabled

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx           # Main layout with header, footer, and dark mode toggle
│   ├── StatsTable.tsx       # Sortable stats table with expandable rows
│   └── LoadingSkeleton.tsx  # Loading placeholder component
├── pages/
│   ├── LandingPage.tsx      # Home page with project overview
│   └── StatsPage.tsx        # Player stats browsing page
├── services/
│   └── api.ts               # API client for fetching player stats
├── App.tsx                  # Main app component with routing
├── types.ts                 # TypeScript type definitions and Region enum
├── constants.ts             # Region options and table header configuration
└── index.tsx                # React DOM root entry point
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd valo-stats
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

## Building

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Linting

Check code quality:

```bash
npm run lint
```

## API Integration

The application fetches player stats from a local API endpoint (default: `http://127.0.0.1:3001/stats`). 

To use a live API, update the `API_BASE_URL` in `src/constants.ts`:

```typescript
// Uncomment for live API
export const API_BASE_URL = "https://vlrggapi.vercel.app/stats";

// Comment out or remove the local API URL
// export const API_BASE_URL = "http://127.0.0.1:3001/stats";
```

## Stats Available

- **Rating**: Player performance rating
- **ACS** (Average Combat Score): Average combat effectiveness
- **K/D**: Kill-to-death ratio
- **KAST%**: Percentage of rounds with a kill, assist, survival, or trade
- **ADR**: Average damage per round
- **HS%**: Headshot percentage
- **Clutch%**: Successful clutch round percentage
- **FK/R** (First Kills Per Round): Early round elimination rate
- **FD/R** (First Deaths Per Round): Early round vulnerability metric

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

Not affiliated with Riot Games. Data provided by [vlr.gg](https://vlr.gg).
