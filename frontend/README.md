# SpendWise Finance Dashboard (Frontend Screening)

SpendWise is a mock-data financial dashboard built for a frontend screening assignment.
The implementation focuses on product thinking, clean UI architecture, responsive behavior, accessibility, and practical state management.

## Assignment Focus

- Build an interactive finance dashboard using static/mock data
- Show a clear component architecture and maintainable code
- Demonstrate responsiveness, RBAC behavior, and interaction quality
- Provide documentation that explains decisions and tradeoffs

## What Is Implemented

- Dashboard overview cards:
  - Net balance
  - Total income
  - Total expenses
  - Average expense ticket
- Transaction explorer:
  - Search by merchant and note
  - Filter by category, type, and month
  - Sort by date, merchant, category, type, and amount
  - CSV export (role-gated)
- Analytics:
  - Enhanced cashflow trend chart with refined visual styling
  - 3D-style spending breakdown pie chart (canvas depth effect)
- RBAC simulation:
  - `Viewer`: read-only, flagged items hidden
  - `Analyst`: read-only, flagged items visible
  - `Manager`: can add transactions
  - `Admin`: can add transactions and export CSV
- Theme and branding:
  - Light/dark theme toggle with persistence in `localStorage`
  - Animated header interactions and polished hero section
- UX states:
  - Loading skeleton while dashboard bootstraps
  - Empty state components for charts and transactions
  - Error state with retry flow for data bootstrapping

## Architecture and State Approach

- Main orchestration in `src/App.jsx`:
  - Holds UI state (filters, sorting, role, theme, modal visibility)
  - Computes derived values using memoized selectors (`useMemo`)
  - Controls loading/error states and retry behavior
- Data source:
  - Static seed data in `src/data/mockData.js`
  - Utility transforms in `src/utils/finance.js`
- Presentation layer:
  - Small reusable components in `src/components/*`
  - Shared status rendering with `StatusMessage`
  - Dedicated skeleton loader with `DashboardSkeleton`

## Accessibility Enhancements

- Skip link for keyboard users to jump to main content
- Semantic landmarks (`main`, sections with labels)
- Improved focus visibility for interactive elements
- Accessible modal behavior:
  - `role="dialog"` and `aria-modal`
  - Described/labelled dialog metadata
  - Escape key closes modal
  - Initial focus lands in first input
- Sortable table improvements:
  - `aria-sort` for sorted columns
  - Screen-reader caption
- Reduced motion support:
  - Honors `prefers-reduced-motion` to limit animations/transitions

## Design and Interaction Decisions

- Kept the product as a single-page dashboard to optimize flow and context:
  - Finance monitoring actions are tightly related
  - Faster interaction loop with fewer route/context transitions
- Prioritized visual hierarchy:
  - Hero highlights key status indicators
  - KPI grid gives immediate health snapshot
  - Analytics and transaction controls follow a top-down decision flow

## Loading, Empty, and Error Strategy

- Loading:
  - Dashboard skeleton placeholders provide structure-first feedback
- Empty:
  - Contextual empty components guide user to reset filters
- Error:
  - Data bootstrapping validation triggers an error card with retry action

## Tradeoffs and Assumptions

- No backend persistence by design for assignment scope
- RBAC behavior is UI-simulated, not token/session enforced
- Chart 3D effect is simulated via Chart.js plugin drawing (not true 3D engine)
- Initial loader is intentionally lightweight to demonstrate UX state handling

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
4. Preview production build:
   ```bash
   npm run preview
   ```

## Project Structure

- `src/App.jsx`: app shell, orchestration, and dashboard state
- `src/components/`: reusable UI modules
- `src/data/mockData.js`: seed records and RBAC definitions
- `src/utils/finance.js`: financial transforms and CSV utility
- `src/index.css`: design system, responsive layout, and themes

## Suggested Submission Extras

- Add screenshots:
  - Light theme dashboard
  - Dark theme dashboard
  - Role switch behavior
  - Empty/error state examples
- Add a short GIF walkthrough:
  - Theme toggle
  - Filters and sorting
  - Add transaction
  - RBAC differences
