import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import AddTransactionForm from './components/AddTransactionForm.jsx';
import CashflowTrendChart from './components/CashflowTrendChart.jsx';
import DashboardSkeleton from './components/DashboardSkeleton.jsx';
import Header from './components/Header.jsx';
import KpiCard from './components/KpiCard.jsx';
import RoleSwitcher from './components/RoleSwitcher.jsx';
import SpendingBreakdownChart from './components/SpendingBreakdownChart.jsx';
import StatusMessage from './components/StatusMessage.jsx';
import TransactionTable from './components/TransactionTable.jsx';
import { mockProfile, roleHighlights, rolePermissions, seededTransactions } from './data/mockData.js';
import {
  buildCategoryBreakdown,
  buildMonthlyTrend,
  formatCurrency,
  formatMonthKey,
  makeTransactionCsv,
  summarizeTransactions,
  toIsoDate,
  toMonthKey,
} from './utils/finance.js';

const createDefaultDraft = () => ({
  amount: '',
  category: 'Groceries',
  date: toIsoDate(new Date()),
  merchant: '',
  note: '',
  type: 'expense',
});

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedTheme = window.localStorage.getItem('spendwise-theme');
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const hasValidTransactionData = (items) =>
  Array.isArray(items) &&
  items.length > 0 &&
  items.every(
    (item) =>
      typeof item.id === 'string' &&
      typeof item.date === 'string' &&
      typeof item.merchant === 'string' &&
      typeof item.category === 'string' &&
      typeof item.type === 'string' &&
      typeof item.amount === 'number',
  );

function App() {
  const hasAuthSession = useSelector((state) => Boolean(state.auth?.user));
  const [theme, setTheme] = useState(getInitialTheme);
  const [activeRole, setActiveRole] = useState('admin');
  const [transactions, setTransactions] = useState(seededTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [draftTransaction, setDraftTransaction] = useState(createDefaultDraft);
  const [addFormError, setAddFormError] = useState('');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [uiState, setUiState] = useState({
    error: '',
    isLoading: true,
  });

  // Derive permissions based on the state
  const permissions = useMemo(() => rolePermissions[activeRole], [activeRole]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('spendwise-theme', theme);
  }, [theme]);

  useEffect(() => {
    let isCurrent = true;
    setUiState({
      error: '',
      isLoading: true,
    });

    const timer = window.setTimeout(() => {
      if (!isCurrent) {
        return;
      }

      if (!hasValidTransactionData(seededTransactions)) {
        setUiState({
          error:
            'Unable to prepare dashboard data. Please retry the mock loader or refresh the page.',
          isLoading: false,
        });
        return;
      }

      setUiState({
        error: '',
        isLoading: false,
      });
    }, 650);

    return () => {
      isCurrent = false;
      window.clearTimeout(timer);
    };
  }, [loadAttempt]);

  const scopedTransactions = useMemo(
    () => transactions.filter((item) => permissions.canViewFlagged || !item.flagged),
    [permissions.canViewFlagged, transactions],
  );

  const monthOptions = useMemo(
    () =>
      Array.from(new Set(transactions.map((item) => toMonthKey(item.date))))
        .filter(Boolean)
        .sort()
        .reverse(),
    [transactions],
  );

  const categoryOptions = useMemo(
    () => Array.from(new Set(transactions.map((item) => item.category))).sort(),
    [transactions],
  );

  const filteredTransactions = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    const filtered = scopedTransactions.filter((item) => {
      const matchesSearch =
        !search ||
        item.merchant.toLowerCase().includes(search) ||
        item.note.toLowerCase().includes(search);
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesMonth = monthFilter === 'all' || toMonthKey(item.date) === monthFilter;
      return matchesSearch && matchesCategory && matchesType && matchesMonth;
    });

    return [...filtered].sort((left, right) => {
      let leftValue = left[sortField];
      let rightValue = right[sortField];

      if (sortField === 'merchant' || sortField === 'category' || sortField === 'type') {
        leftValue = leftValue.toLowerCase();
        rightValue = rightValue.toLowerCase();
      }

      if (leftValue === rightValue) {
        return 0;
      }
      const direction = sortDirection === 'asc' ? 1 : -1;
      return leftValue > rightValue ? direction : -direction;
    });
  }, [categoryFilter, monthFilter, scopedTransactions, searchTerm, sortDirection, sortField, typeFilter]);

  // Filter transactions based on 'canViewFlagged' permission
  const filteredData = useMemo(() => {
    if (permissions.canViewFlagged) return filteredTransactions;
    return filteredTransactions.filter((txn) => !txn.flagged);
  }, [filteredTransactions, permissions.canViewFlagged]);

  const summary = useMemo(() => summarizeTransactions(filteredTransactions), [filteredTransactions]);

  const averageExpenseTicket =
    summary.expenseTransactionCount > 0 ? summary.expense / summary.expenseTransactionCount : 0;
  const savingsRate = summary.income > 0 ? (summary.balance / summary.income) * 100 : 0;
  const categoryBreakdown = useMemo(
    () => buildCategoryBreakdown(filteredTransactions),
    [filteredTransactions],
  );
  const monthlyTrend = useMemo(() => buildMonthlyTrend(scopedTransactions), [scopedTransactions]);
  const flaggedCount = scopedTransactions.filter((item) => item.flagged).length;
  const topExpenseInsight = categoryBreakdown[0] ?? null;
  const largestTransaction = useMemo(() => {
    if (!filteredTransactions.length) {
      return null;
    }

    return filteredTransactions.reduce((largest, current) =>
      current.amount > largest.amount ? current : largest,
    );
  }, [filteredTransactions]);
  const flaggedShare = scopedTransactions.length
    ? (flaggedCount / scopedTransactions.length) * 100
    : 0;

  const handleSortChange = (field) => {
    if (field === sortField) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortField(field);
    setSortDirection(field === 'merchant' ? 'asc' : 'desc');
  };

  const handleDraftFieldChange = (event) => {
    const { name, value } = event.target;
    setAddFormError('');
    setDraftTransaction((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const openAddModal = useCallback(() => {
    setAddFormError('');
    setIsAddFormOpen(true);
  }, []);

  const closeAddModal = useCallback(() => {
    setAddFormError('');
    setIsAddFormOpen(false);
    setDraftTransaction(createDefaultDraft());
  }, []);

  const handleTransactionSubmit = (event) => {
    event.preventDefault();

    if (!permissions.canAddTransaction) {
      setAddFormError('Current role cannot add transactions. Switch to Manager or Admin.');
      return;
    }

    const amountValue = Number(draftTransaction.amount);
    const merchantValue = draftTransaction.merchant.trim();
    const dateValue = draftTransaction.date;
    if (!Number.isFinite(amountValue) || amountValue <= 0 || !merchantValue || !dateValue) {
      setAddFormError('Please enter a valid amount, date, and merchant/source.');
      return;
    }

    const nextTransaction = {
      amount: Number(amountValue.toFixed(2)),
      category: draftTransaction.category.trim() || 'General',
      date: dateValue,
      flagged: draftTransaction.type === 'expense' && amountValue >= 2000,
      id: `txn-${Date.now()}`,
      merchant: merchantValue,
      note: draftTransaction.note.trim(),
      type: draftTransaction.type,
    };

    setTransactions((current) => [nextTransaction, ...current]);
    resetFilters();
    closeAddModal();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setTypeFilter('all');
    setMonthFilter('all');
    setSortField('date');
    setSortDirection('desc');
  };

  const exportAsCsv = () => {
    if (!permissions.canExport) {
      return;
    }

    const csv = makeTransactionCsv(filteredTransactions);
    const file = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const fileUrl = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.download = `transactions-${toIsoDate(new Date())}.csv`;
    anchor.click();
    URL.revokeObjectURL(fileUrl);
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const retryDataLoad = () => {
    setLoadAttempt((current) => current + 1);
  };

  return (
    <div className="app-background">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <div className="app-shell">
        <Header onToggleTheme={toggleTheme} theme={theme} />

        <main className="app-main" id="main-content" aria-busy={uiState.isLoading}>
          {uiState.isLoading ? (
            <DashboardSkeleton />
          ) : uiState.error ? (
            <StatusMessage
              actionLabel="Retry Loading"
              description={uiState.error}
              onAction={retryDataLoad}
              title="Could Not Load Dashboard"
              variant="error"
            />
          ) : (
            <>
              <header className="hero-panel panel">
                <div className="hero-primary">
                  <h2 className="hero-title">SpendWise Finance Dashboard</h2>
                  <p className="hero-copy">
                    A data-driven financial workspace focused on summary insights, transaction
                    exploration, responsive interaction, and role-based behavior.
                  </p>

                  <div className="hero-ribbon" aria-label="Live dashboard highlights">
                    <span className="hero-chip chip-accent">Real-Time Mock Snapshot</span>
                    <span className="hero-chip chip-neutral">
                      {permissions.canExport ? 'Export Enabled' : 'Export Restricted'}
                    </span>
                    <span className="hero-chip chip-warning">
                      {permissions.canViewFlagged
                        ? `${flaggedCount} flagged records visible`
                        : 'Flagged records hidden'}
                    </span>
                  </div>

                  <div className="hero-stats" aria-label="Primary performance summary">
                    <article className="hero-stat-card">
                      <p>Net Balance</p>
                      <strong>{formatCurrency(summary.balance)}</strong>
                    </article>
                    <article className="hero-stat-card">
                      <p>Savings Rate</p>
                      <strong>{savingsRate.toFixed(1)}%</strong>
                    </article>
                  </div>
                </div>

                <div className="hero-meta">
                  <div className="hero-meta-item">
                    <span>Owner</span>
                    <strong>{mockProfile.owner}</strong>
                  </div>
                  <div className="hero-meta-item">
                    <span>Tracking Window</span>
                    <strong>{mockProfile.coverage}</strong>
                  </div>
                  <div className="hero-meta-item">
                    <span>Visible Records</span>
                    <strong>{filteredTransactions.length}</strong>
                  </div>
                </div>
              </header>

              <section className="panel role-panel" aria-label="Role behavior preview">
                <div className="section-heading">
                  <h2>RBAC Preview</h2>
                  <p>Switch roles to validate access boundaries in real time.</p>
                </div>
                <RoleSwitcher
                  activeRole={activeRole}
                  onRoleChange={setActiveRole}
                  permissions={permissions}
                />
                <p className="role-note" aria-live="polite">
                  {roleHighlights[activeRole]}
                </p>
              </section>

              <section className="kpi-grid" aria-label="Financial summary cards">
                <KpiCard
                  subtitle={`${savingsRate.toFixed(1)}% savings rate`}
                  title="Net Balance"
                  tone={summary.balance >= 0 ? 'positive' : 'negative'}
                  value={formatCurrency(summary.balance)}
                />
                <KpiCard
                  subtitle="Total incoming cash"
                  title="Total Income"
                  tone="accent"
                  value={formatCurrency(summary.income)}
                />
                <KpiCard
                  subtitle="Total outgoing cash"
                  title="Total Expenses"
                  tone="warning"
                  value={formatCurrency(summary.expense)}
                />
                <KpiCard
                  subtitle={`Across ${summary.expenseTransactionCount} expense entries`}
                  title="Avg Expense Ticket"
                  tone="neutral"
                  value={formatCurrency(averageExpenseTicket)}
                />
              </section>

              <section className="analytics-grid" aria-label="Financial analytics charts">
                <article className="panel chart-panel">
                  <div className="section-heading">
                    <h2>Cashflow Trend</h2>
                    <p>Monthly income versus expenses from the mock timeline.</p>
                  </div>
                  <CashflowTrendChart data={monthlyTrend} theme={theme} />
                </article>

                <article className="panel chart-panel">
                  <div className="section-heading">
                    <h2>Spending Pattern</h2>
                    <p>Expense distribution by category for the current filter set.</p>
                  </div>
                  <SpendingBreakdownChart data={categoryBreakdown} theme={theme} />
                  <p className="chart-footnote" aria-live="polite">
                    {permissions.canViewFlagged
                      ? `${flaggedCount} high-risk transactions currently visible.`
                      : 'Viewer role hides high-risk transactions.'}
                  </p>
                </article>
              </section>

              <section className="panel insights-panel" aria-label="Insights section">
                <div className="section-heading">
                  <h2>Insights</h2>
                  <p>Actionable observations generated from your current filters and state.</p>
                </div>

                <div className="insights-grid">
                  <article className="insight-card">
                    <p className="insight-label">Top Expense Category</p>
                    <strong>{topExpenseInsight ? topExpenseInsight.label : 'No expense data'}</strong>
                    <span>
                      {topExpenseInsight
                        ? formatCurrency(topExpenseInsight.value)
                        : 'Add expense records to generate this insight.'}
                    </span>
                  </article>

                  <article className="insight-card">
                    <p className="insight-label">Largest Entry</p>
                    <strong>{largestTransaction ? largestTransaction.merchant : 'No records'}</strong>
                    <span>
                      {largestTransaction
                        ? `${largestTransaction.type === 'income' ? 'Income' : 'Expense'} - ${formatCurrency(largestTransaction.amount)}`
                        : 'Create transactions to unlock this metric.'}
                    </span>
                  </article>

                  <article className="insight-card">
                    <p className="insight-label">Flagged Share</p>
                    <strong>{scopedTransactions.length ? `${flaggedShare.toFixed(1)}%` : '0%'}</strong>
                    <span>{`${flaggedCount} of ${scopedTransactions.length} visible records flagged.`}</span>
                  </article>

                  <article className="insight-card">
                    <p className="insight-label">State Management</p>
                    <strong>Redux Toolkit</strong>
                    <span>
                      {hasAuthSession
                        ? 'Authenticated session is available in global store.'
                        : 'Guest session is currently stored globally.'}
                    </span>
                  </article>
                </div>
              </section>

              <section className="panel transactions-panel" aria-label="Transaction explorer">
                <div className="toolbar">
                  <div className="section-heading">
                    <h2>Transactions</h2>
                    <p>Filter, sort, and inspect account activity with quick controls.</p>
                  </div>

                  <div className="toolbar-actions">
                    <button className="btn btn-ghost" onClick={resetFilters} type="button">
                      Reset Filters
                    </button>
                    <button
                      className="btn btn-ghost"
                      disabled={!permissions.canExport}
                      onClick={exportAsCsv}
                      type="button"
                    >
                      Export CSV
                    </button>
                    <button
                      className="btn btn-primary"
                      disabled={!permissions.canAddTransaction}
                      onClick={openAddModal}
                      type="button"
                    >
                      Add Transaction
                    </button>
                  </div>
                </div>

                <div className="filter-grid">
                  <label className="field">
                    <span>Search</span>
                    <input
                      name="searchTerm"
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Merchant or note"
                      type="text"
                      value={searchTerm}
                    />
                  </label>
                  <label className="field">
                    <span>Category</span>
                    <select
                      name="categoryFilter"
                      onChange={(event) => setCategoryFilter(event.target.value)}
                      value={categoryFilter}
                    >
                      <option value="all">All categories</option>
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>Type</span>
                    <select
                      name="typeFilter"
                      onChange={(event) => setTypeFilter(event.target.value)}
                      value={typeFilter}
                    >
                      <option value="all">Income + Expense</option>
                      <option value="income">Income only</option>
                      <option value="expense">Expense only</option>
                    </select>
                  </label>
                  <label className="field">
                    <span>Month</span>
                    <select
                      name="monthFilter"
                      onChange={(event) => setMonthFilter(event.target.value)}
                      value={monthFilter}
                    >
                      <option value="all">All months</option>
                      {monthOptions.map((month) => (
                        <option key={month} value={month}>
                          {formatMonthKey(month)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <TransactionTable
                  canViewFlagged={permissions.canViewFlagged}
                  canExport={permissions.canExport}
                  canAdd={permissions.canAddTransaction}
                  onAddTransaction={openAddModal}
                  onExport={exportAsCsv}
                  onResetFilters={resetFilters}
                  onSortChange={handleSortChange}
                  sortDirection={sortDirection}
                  sortField={sortField}
                  transactions={filteredData}
                />
              </section>
            </>
          )}
        </main>

        <footer className="app-footer">© 2026 by Rohit Jaiswal</footer>
      </div>

      {isAddFormOpen && !uiState.isLoading && !uiState.error && (
        <AddTransactionForm
          draft={draftTransaction}
          errorMessage={addFormError}
          onClose={closeAddModal}
          onFieldChange={handleDraftFieldChange}
          onSubmit={handleTransactionSubmit}
        />
      )}
    </div>
  );
}

export default App;
