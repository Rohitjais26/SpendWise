const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
});

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
});

export function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}

export function toMonthKey(dateValue) {
  if (!dateValue || typeof dateValue !== 'string') {
    return '';
  }
  return dateValue.slice(0, 7);
}

export function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

export function formatMonthKey(monthKey) {
  const [year, month] = monthKey.split('-');
  const parsed = new Date(Number(year), Number(month) - 1, 1);
  return monthFormatter.format(parsed);
}

export function summarizeTransactions(transactions) {
  let income = 0;
  let expense = 0;
  let expenseTransactionCount = 0;

  transactions.forEach((item) => {
    if (item.type === 'income') {
      income += item.amount;
      return;
    }

    expense += item.amount;
    expenseTransactionCount += 1;
  });

  return {
    balance: income - expense,
    expense,
    expenseTransactionCount,
    income,
  };
}

export function buildCategoryBreakdown(transactions) {
  const grouped = transactions.reduce((accumulator, item) => {
    if (item.type !== 'expense') {
      return accumulator;
    }

    const currentValue = accumulator[item.category] ?? 0;
    accumulator[item.category] = currentValue + item.amount;
    return accumulator;
  }, {});

  return Object.entries(grouped)
    .map(([label, value]) => ({ label, value: Number(value.toFixed(2)) }))
    .sort((left, right) => right.value - left.value);
}

export function buildMonthlyTrend(transactions) {
  const grouped = transactions.reduce((accumulator, item) => {
    const monthKey = toMonthKey(item.date);
    if (!monthKey) {
      return accumulator;
    }

    const bucket = accumulator[monthKey] ?? { expense: 0, income: 0, month: monthKey };
    if (item.type === 'income') {
      bucket.income += item.amount;
    } else {
      bucket.expense += item.amount;
    }

    accumulator[monthKey] = bucket;
    return accumulator;
  }, {});

  return Object.values(grouped)
    .sort((left, right) => left.month.localeCompare(right.month))
    .map((item) => ({
      expense: Number(item.expense.toFixed(2)),
      income: Number(item.income.toFixed(2)),
      label: formatMonthKey(item.month),
      month: item.month,
    }));
}

export function makeTransactionCsv(transactions) {
  const header = ['id', 'date', 'merchant', 'category', 'type', 'amount', 'flagged', 'note'];
  const rows = transactions.map((item) => [
    item.id,
    item.date,
    item.merchant,
    item.category,
    item.type,
    item.amount.toFixed(2),
    String(item.flagged),
    item.note.replaceAll('"', '""'),
  ]);

  const csvRows = [
    header.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ];

  return csvRows.join('\n');
}
