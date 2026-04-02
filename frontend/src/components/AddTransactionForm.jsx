function AddTransactionForm({ draft, onClose, onFieldChange, onSubmit }) {
  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <form className="modal-card" onClick={(event) => event.stopPropagation()} onSubmit={onSubmit}>
        <div className="modal-header">
          <h3>Add Transaction</h3>
          <button className="close-button" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <p className="modal-copy">
          New expense entries above $2,000 are automatically marked for review.
        </p>

        <div className="form-grid">
          <label className="field">
            <span>Type</span>
            <select name="type" onChange={onFieldChange} value={draft.type}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>

          <label className="field">
            <span>Amount</span>
            <input
              min="0.01"
              name="amount"
              onChange={onFieldChange}
              placeholder="0.00"
              required
              step="0.01"
              type="number"
              value={draft.amount}
            />
          </label>

          <label className="field">
            <span>Date</span>
            <input name="date" onChange={onFieldChange} required type="date" value={draft.date} />
          </label>

          <label className="field">
            <span>Category</span>
            <input
              name="category"
              onChange={onFieldChange}
              placeholder="Groceries"
              required
              type="text"
              value={draft.category}
            />
          </label>

          <label className="field field-full">
            <span>Merchant / Source</span>
            <input
              name="merchant"
              onChange={onFieldChange}
              placeholder="Store or payer name"
              required
              type="text"
              value={draft.merchant}
            />
          </label>

          <label className="field field-full">
            <span>Note</span>
            <textarea
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
