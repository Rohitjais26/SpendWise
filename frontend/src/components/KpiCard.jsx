function KpiCard({ title, value, subtitle, tone }) {
  return (
    <article className={`panel kpi-card tone-${tone}`}>
      <p className="kpi-title">{title}</p>
      <p className="kpi-value">{value}</p>
      <p className="kpi-subtitle">{subtitle}</p>
    </article>
  );
}

export default KpiCard;
