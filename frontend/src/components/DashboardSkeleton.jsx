function DashboardSkeleton() {
  const skeletonCards = Array.from({ length: 4 }, (_, index) => (
    <div className="panel skeleton-panel skeleton-card" key={`skeleton-card-${index}`} />
  ));

  return (
    <section className="dashboard-skeleton" role="status" aria-live="polite">
      <p className="sr-only">Loading dashboard content</p>
      <div className="panel skeleton-panel skeleton-hero" />
      <div className="skeleton-kpi-grid">{skeletonCards}</div>
      <div className="skeleton-analytics-grid">
        <div className="panel skeleton-panel skeleton-chart-large" />
        <div className="panel skeleton-panel skeleton-chart-small" />
      </div>
      <div className="panel skeleton-panel skeleton-table" />
    </section>
  );
}

export default DashboardSkeleton;
