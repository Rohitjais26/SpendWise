import { useEffect, useRef } from 'react';

function AddTransactionForm({ draft, errorMessage, onClose, onFieldChange, onSubmit }) {
  const amountInputRef = useRef(null);

  useEffect(() => {
    amountInputRef.current?.focus();

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <form
        aria-describedby="add-transaction-description"
        aria-labelledby="add-transaction-title"
        aria-modal="true"
        className="modal-card"
        onClick={(event) => event.stopPropagation()}
        onSubmit={onSubmit}
        role="dialog"
      >
        <div className="modal-header">
          <h3 id="add-transaction-title">Add Transaction</h3>
          <button className="close-button" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <p className="modal-copy" id="add-transaction-description">
          New expense entries above $2,000 are automatically marked for review.
        </p>
        {errorMessage && (
          <p className="modal-copy form-error" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="form-grid">
          <label className="field" htmlFor="tx-type">
            <span>Type</span>
            <select id="tx-type" name="type" onChange={onFieldChange} value={draft.type}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>

          <label className="field" htmlFor="tx-amount">
            <span>Amount</span>
            <input
              id="tx-amount"
              min="0.01"
              name="amount"
              onChange={onFieldChange}
              placeholder="0.00"
              ref={amountInputRef}
              required
              step="0.01"
              type="number"
              value={draft.amount}
            />
          </label>

          <label className="field" htmlFor="tx-date">
            <span>Date</span>
            <input
              id="tx-date"
              name="date"
              onChange={onFieldChange}
              required
              type="date"
              value={draft.date}
            />
          </label>

          <label className="field" htmlFor="tx-category">
            <span>Category</span>
            <input
              id="tx-category"
              name="category"
              onChange={onFieldChange}
              placeholder="Groceries"
              required
              type="text"
              value={draft.category}
            />
          </label>

          <label className="field field-full" htmlFor="tx-merchant">
            <span>Merchant / Source</span>
            <input
              id="tx-merchant"
              name="merchant"
              onChange={onFieldChange}
              placeholder="Store or payer name"
              required
              type="text"
              value={draft.merchant}
            />
          </label>

          <label className="field field-full" htmlFor="tx-note">
            <span>Note</span>
            <textarea
              id="tx-note"
              name="note"
              onChange={onFieldChange}
              placeholder="Optional context"
              rows={3}
              value={draft.note}
            />
          </label>
        </div>

        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="btn btn-primary" type="submit">
            Save Transaction
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTransactionForm;
