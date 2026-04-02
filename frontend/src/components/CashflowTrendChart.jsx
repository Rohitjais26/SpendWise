import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
});

function createGradient(chart, topColor, bottomColor) {
  const { chartArea, ctx } = chart;
  if (!chartArea) {
    return topColor;
  }

  const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
  gradient.addColorStop(0, topColor);
  gradient.addColorStop(1, bottomColor);
  return gradient;
}

function CashflowTrendChart({ data, theme = 'light' }) {
  if (!data.length) {
    return <p className="empty-state">No chart data available for this filter set.</p>;
  }

  const isDark = theme === 'dark';
  const axisColor = isDark ? '#a8bdd4' : '#486581';
  const legendColor = isDark ? '#d7e5f7' : '#243b53';
  const gridColor = isDark ? 'rgba(120, 151, 184, 0.2)' : 'rgba(36, 59, 83, 0.09)';
  const tooltipBackground = isDark ? 'rgba(8, 19, 35, 0.92)' : 'rgba(255, 255, 255, 0.95)';
  const tooltipText = isDark ? '#f3f8ff' : '#102a43';

  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        backgroundColor: (context) =>
          createGradient(context.chart, 'rgba(45, 212, 191, 0.45)', 'rgba(45, 212, 191, 0.02)'),
        borderColor: '#14b8a6',
        borderWidth: 3,
        data: data.map((item) => item.income),
        fill: true,
        label: 'Income',
        pointBackgroundColor: '#14b8a6',
        pointBorderColor: isDark ? '#0a1d33' : '#ffffff',
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        pointRadius: 4,
        tension: 0.42,
      },
      {
        backgroundColor: (context) =>
          createGradient(context.chart, 'rgba(251, 146, 60, 0.4)', 'rgba(251, 146, 60, 0.02)'),
        borderColor: '#f97316',
        borderWidth: 3,
        data: data.map((item) => item.expense),
        fill: true,
        label: 'Expenses',
        pointBackgroundColor: '#f97316',
        pointBorderColor: isDark ? '#0a1d33' : '#ffffff',
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        pointRadius: 4,
        tension: 0.42,
      },
    ],
  };

  const chartOptions = {
    animation: {
      duration: 1000,
      easing: 'easeOutCubic',
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: legendColor,
          padding: 16,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: tooltipBackground,
        bodyColor: tooltipText,
        borderColor: isDark ? '#274567' : '#d9e2ec',
        borderWidth: 1,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${currencyFormatter.format(context.parsed.y)}`,
        },
        titleColor: tooltipText,
      },
    },
    scales: {
      x: {
        grid: {
          borderDash: [5, 4],
          color: gridColor,
          drawTicks: false,
        },
        ticks: {
          color: axisColor,
          font: {
            weight: 600,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          borderDash: [5, 4],
          color: gridColor,
          drawTicks: false,
        },
        ticks: {
          callback: (value) => `$${Number(value).toLocaleString()}`,
          color: axisColor,
          font: {
            weight: 600,
          },
        },
      },
    },
  };

  return (
    <div className="chart-wrapper chart-wrapper-trend">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

export default CashflowTrendChart;
