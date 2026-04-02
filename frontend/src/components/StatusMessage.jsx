const variantConfig = {
  empty: {
    icon: '📭',
    role: 'status',
  },
  error: {
    icon: '⚠️',
    role: 'alert',
  },
  info: {
    icon: 'ℹ️',
    role: 'status',
  },
};

function StatusMessage({ actionLabel, description, onAction, title, variant = 'empty' }) {
  const config = variantConfig[variant] ?? variantConfig.empty;

  return (
    <section
      aria-live="polite"
      className={`status-message status-${variant}`}
      role={config.role}
    >
      <p className="status-icon" aria-hidden="true">
        {config.icon}
      </p>
      <div className="status-content">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      {actionLabel && typeof onAction === 'function' && (
        <button className="btn btn-ghost status-action" onClick={onAction} type="button">
          {actionLabel}
        </button>
      )}
    </section>
  );
}

export default StatusMessage;
