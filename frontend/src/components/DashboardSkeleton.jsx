function DashboardSkeleton() {
  // Generates 4 placeholder cards to match the KPI grid layout
  const skeletonCards = Array.from({ length: 4 }, (_, index) => (
    <div className="panel skeleton-panel skeleton-card" key={`skeleton-card-${index}`} />
  ));

  return (
    <section 
      className="dashboard-skeleton" 
      role="status" 
      aria-live="polite"
    >
      {/* Screen reader only text for accessibility */}
      <p className="sr-only">Loading dashboard content</p>
      
      {/* Hero section placeholder */}
      <div className="panel skeleton-panel skeleton-hero" />
      
      {/* KPI grid section placeholder */}
      <div className="skeleton-kpi-grid">
        {skeletonCards}
      </div>
      
      {/* Analytics visualization section placeholders */}
      <div className="skeleton-analytics-grid">
        <div className="panel skeleton-panel skeleton-chart-large" />
        <div className="panel skeleton-panel skeleton-chart-small" />
      </div>
      
      {/* Transaction table section placeholder */}
      <div className="panel skeleton-panel skeleton-table" />
    </section>
  );
}

export default DashboardSkeleton;