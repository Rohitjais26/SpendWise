# SpendWise - Finance Dashboard UI

Hi, this is my frontend screening assignment build.

I built a simple finance dashboard where a user can:
- check financial summary cards
- view trends and spending breakdown
- explore transactions with filters/search/sort
- switch roles and see UI capability changes

The app is intentionally frontend-first and uses mock data so it runs without backend dependency.

## Quick Requirement Check

 Dashboard Overview with Summary Cards
 Time Based Visualization (cashflow trend chart)
 Categorical Visualization (spending breakdown pie)
 Transaction List with Details
 Transaction Filtering
 Transaction Sorting / Search
 Role Based UI (viewer/admin, plus analyst/manager)
 Insights Section
 State Management (Redux configured + local UI state where practical)
 Responsive Design

## Features Included

 1) Dashboard + Insights
- Net balance, income, expenses, average expense ticket
- Dedicated `Insights` section with:
  - top expense category
  - largest visible transaction
  - flagged share
  - state management note

 2) Charts
- Cashflow trend (line chart)
- Spending pattern (pie chart with custom pseudo-3D effect)
- Chart empty states when filtered data is unavailable

 3) Transactions
- Search by merchant/note
- Filter by category, type, and month
- Sort by date, merchant, category, type, and amount
- Add transaction modal (role-gated)
- CSV export (admin-gated)

 4) RBAC Demo
- `Viewer`: read-only, cannot view flagged
- `Analyst`: read-only, can view flagged
- `Manager`: can add transactions
- `Admin`: can add + export CSV

 5) UX / UI
- Dark and light mode toggle
- Animated header interactions
- Loading skeleton
- Error/empty states
- Keyboard-friendly focus styles + skip link

## Tech Stack

- React + Vite
- Chart.js + react-chartjs-2
- Framer Motion
- Redux Toolkit + React Redux
- Plain CSS (custom responsive layout)

## Local Setup

Run from `frontend` folder:

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

## Notes / Tradeoffs

- Main dashboard works on mock seeded data (`src/data/mockData.js`).
- Backend is not required for demoing assignment features.
- RBAC is simulated at UI level for screening scope.
- I used local component state for fast dashboard interactions, and Redux store is wired at app root for global state architecture.

## Project Structure (important files)

- `src/App.jsx` - dashboard orchestration, filters, sorting, role logic
- `src/components/*` - reusable UI pieces
- `src/data/mockData.js` - transactions + role permissions
- `src/utils/finance.js` - financial calculations and CSV formatter
- `src/app/store.js` - Redux store setup
- `src/main.jsx` - Redux Provider wiring

## If I had more time

add persistent storage for created transactions
add tests for filter/sort/role behavior
split large bundle with route-level code splitting
