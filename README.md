# SpendWise - Finance Dashboard UI

SpendWise is a frontend finance dashboard built for a frontend developer screening assignment.

It focuses on clean UI, practical interactions, and clear role-based behavior using mock data.

## What This Project Covers

- Dashboard overview with summary cards
- Time-based visualization (cashflow trend)
- Categorical visualization (spending breakdown)
- Transaction list with details
- Transaction filtering
- Transaction sorting and search
- Role-based UI (Viewer/Admin, plus Analyst/Manager)
- Dedicated insights section
- State management approach (Redux + local UI state)
- Responsive design

## Feature Highlights

- Light/Dark theme toggle
- Add transaction modal (role gated)
- CSV export (admin only)
- Loading, empty, and error states
- Keyboard-friendly focus states and skip link
- Custom chart styling, including pseudo-3D pie effect

## Tech Stack

- React (Vite)
- Redux Toolkit + React Redux
- Chart.js + react-chartjs-2
- Framer Motion
- Plain CSS (responsive custom layout)

## Project Structure

- `frontend/` - main app used for assignment submission
- `backend/` - optional API code (not required for current mock-data demo)

Important frontend files:

- `frontend/src/App.jsx` - app orchestration and dashboard logic
- `frontend/src/components/` - reusable UI components
- `frontend/src/data/mockData.js` - seed data and role permissions
- `frontend/src/utils/finance.js` - calculations and CSV helper
- `frontend/src/app/store.js` - Redux store
- `frontend/src/main.jsx` - app entry + Redux Provider

## Run Locally

```bash
cd frontend
npm install
npm run dev
```

Build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Deployment (Vercel)

- Import this repo in Vercel
- Set Root Directory to `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

## Notes

- Current dashboard behavior runs on mock/seeded frontend data.
- Backend deployment is not required for assignment demo.
- RBAC is demonstrated at UI level for screening scope.

## Author

Rohit Jaiswal
