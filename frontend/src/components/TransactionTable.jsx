import { formatCurrency } from '../utils/finance.js';
import StatusMessage from './StatusMessage.jsx';

const tableColumns = [
  { key: 'date', label: 'Date' },
  { key: 'merchant', label: 'Merchant' },
  { key: 'category', label: 'Category' },
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount' },
];

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

function SortLabel({ column, onSortChange, sortDirection, sortField }) {
  const isActive = sortField === column.key;
  const direction = sortDirection === 'asc' ? 'ascending' : 'descending';
  const indicator = isActive ? (sortDirection === 'asc' ? '↑' : '↓') : '';

  return (
    <button
      aria-label={`Sort by ${column.label} ${isActive ? direction : ''}`}
      className={`sort-button ${isActive ? 'active' : ''}`}
      onClick={() => onSortChange(column.key)}
      type="button"
    >
      {column.label}
      <span>{indicator}</span>
    </button>
  );
}

function TransactionTable({
  canAdd,
  canExport,
  canViewFlagged,
  onAddTransaction,
  onExport,
  onResetFilters,
  onSortChange,
  sortDirection,
  sortField,
  transactions,
}) {
  const handleAddTransaction = () => {
    if (!canAdd) {
      return;
    }

    onAddTransaction?.();
  };

  const handleExportCsv = () => {
    if (!canExport) {
      return;
    }

    onExport?.();
  };

  if (!transactions.length) {
    return (
      <StatusMessage
        actionLabel="Reset Filters"
        description="Try clearing search text or category filters to view records again."
        onAction={onResetFilters}
        title="No Transactions Match"
        variant="empty"
      />
    );
  }

  return (
    <>
      <div className="toolbar-actions table-actions">
        {canAdd && (
          <button className="btn btn-primary" onClick={handleAddTransaction} type="button">
            + New Transaction
          </button>
        )}
        {canExport && (
          <button className="btn btn-ghost" onClick={handleExportCsv} type="button">
            Export CSV
          </button>
        )}
      </div>

      <div className="table-wrap">
        <table>
          <caption className="sr-only">
            Transaction list with sortable columns for date, merchant, category, type, and amount.
          </caption>
          <thead>
            <tr>
              {tableColumns.map((column) => (
                <th
                  aria-sort={
                    sortField === column.key
                      ? sortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                  key={column.key}
                  scope="col"
                >
                  <SortLabel
                    column={column}
                    onSortChange={onSortChange}
                    sortDirection={sortDirection}
                    sortField={sortField}
                  />
                </th>
              ))}
              {canViewFlagged && (
                <th scope="col">
                  <span className="header-text">Risk Flag</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {transactions.map((item) => (
              <tr key={item.id}>
                <td>{dateFormatter.format(new Date(item.date))}</td>
                <td>
                  <p className="merchant">{item.merchant}</p>
                  {item.note && <p className="note">{item.note}</p>}
                </td>
                <td>{item.category}</td>
                <td>
                  <span className={`type-chip ${item.type}`}>{item.type}</span>
                </td>
                <td className={item.type === 'income' ? 'amount-income' : 'amount-expense'}>
                  {item.type === 'income' ? '+' : '-'}
                  {formatCurrency(item.amount)}
                </td>
                {canViewFlagged && (
                  <td>
                    <span className={`flag-chip ${item.flagged ? 'flagged' : 'safe'}`}>
                      {item.flagged ? 'Review' : 'Normal'}
                    </span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default TransactionTable;
