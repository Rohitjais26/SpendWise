# SpendWise Finance Dashboard (Frontend Screening)

This project is a static/mock-data finance dashboard built for a frontend screening assignment.
It focuses on interface design quality, state handling, responsive behavior, and RBAC-style UX behavior.

## Stack

- React + Vite
- Plain CSS (custom design system)
- `chart.js` + `react-chartjs-2` for visual analytics
- `framer-motion` for branded title and micro-interactions

## Features Implemented

- Dashboard overview cards:
  - Net balance
  - Total income
  - Total expenses
  - Average expense ticket
- Transaction exploration:
  - Search (merchant + note)
  - Filter by category, type, month
  - Sort by date, merchant, category, type, amount
- Spending pattern analytics:
  - Monthly cashflow trend chart
  - Category breakdown donut chart
- RBAC behavior (UI-level):
  - `Viewer`: read-only + flagged records hidden
  - `Analyst`: flagged records visible, no write/export
  - `Manager`: can add transactions, no export
  - `Admin`: full access including CSV export
- Add transaction flow:
  - Modal form
  - Basic validations
  - Auto-flags high-value expenses above $2,000
- Responsive UI:
  - Mobile, tablet, desktop layouts
  - Scroll-safe table on small screens
- Theming:
  - Dark mode + light mode toggle
  - Theme preference persisted in `localStorage`

## Assumptions

- Backend integration is intentionally omitted per assignment flexibility.
- RBAC is simulated in frontend state to demonstrate conditional rendering and behavior boundaries.
- Data is seeded mock data for Nov 2025 - Mar 2026 to show trend continuity.

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
4. Preview build:
   ```bash
   npm run preview
   ```

## Project Structure

- `src/App.jsx`: main dashboard page and state orchestration
- `src/data/mockData.js`: seeded transactions and RBAC definitions
- `src/utils/finance.js`: summary + chart + CSV helper utilities
- `src/components/*`: reusable UI pieces (role switcher, charts, table, modal form)
- `src/index.css`: full custom styles and responsive rules
