import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Legend, Tooltip);

const palette = ['#0f766e', '#0284c7', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
});

function darkenHexColor(hex, factor = 0.52) {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) {
    return '#1f2937';
  }

  const normalized = hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex;
  const red = Math.max(0, Math.floor(parseInt(normalized.slice(1, 3), 16) * factor));
  const green = Math.max(0, Math.floor(parseInt(normalized.slice(3, 5), 16) * factor));
  const blue = Math.max(0, Math.floor(parseInt(normalized.slice(5, 7), 16) * factor));

  return `rgb(${red}, ${green}, ${blue})`;
}

const pseudo3DPiePlugin = {
  id: 'pseudo3DPie',
  beforeDatasetDraw(chart, args, options) {
    if (args.index !== 0) {
      return;
    }

    const { ctx } = chart;
    const meta = chart.getDatasetMeta(args.index);
    const dataset = chart.data.datasets[args.index];
    const depth = options?.depth ?? 12;

    meta.data.forEach((arc, index) => {
      const color = Array.isArray(dataset.backgroundColor)
        ? dataset.backgroundColor[index]
        : dataset.backgroundColor;
      const sideColor = darkenHexColor(color);
      const { endAngle, outerRadius, startAngle, x, y } = arc.getProps(
        ['endAngle', 'outerRadius', 'startAngle', 'x', 'y'],
        true,
      );

      for (let layer = depth; layer > 0; layer -= 1) {
        ctx.beginPath();
        ctx.moveTo(x, y + layer);
        ctx.arc(x, y + layer, outerRadius, startAngle, endAngle);
        ctx.lineTo(x, y + layer);
        ctx.closePath();
        ctx.fillStyle = sideColor;
        ctx.globalAlpha = 0.09 + layer / (depth * 15);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    });
  },
};

ChartJS.register(pseudo3DPiePlugin);

function SpendingBreakdownChart({ data, theme = 'light' }) {
  if (!data.length) {
    return <p className="empty-state">No expense data available for this filter set.</p>;
  }

  const isDark = theme === 'dark';
  const legendColor = isDark ? '#d7e5f7' : '#243b53';
  const tooltipBackground = isDark ? 'rgba(8, 19, 35, 0.92)' : 'rgba(255, 255, 255, 0.95)';
  const tooltipText = isDark ? '#f3f8ff' : '#102a43';
  const borderColor = isDark ? '#132842' : '#ffffff';

  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        backgroundColor: data.map((_, index) => palette[index % palette.length]),
        borderColor,
        borderWidth: 2,
        data: data.map((item) => item.value),
        hoverOffset: 10,
        offset: 2,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 16,
      },
    },
    plugins: {
      legend: {
        labels: {
          color: legendColor,
          padding: 14,
          usePointStyle: true,
        },
        position: 'bottom',
      },
      pseudo3DPie: {
        depth: 12,
      },
      tooltip: {
        backgroundColor: tooltipBackground,
        bodyColor: tooltipText,
        borderColor: isDark ? '#274567' : '#d9e2ec',
        borderWidth: 1,
        callbacks: {
          label: (context) => `${context.label}: ${currencyFormatter.format(context.parsed)}`,
        },
        titleColor: tooltipText,
      },
    },
    rotation: -35,
  };

  return (
    <div className="chart-wrapper chart-wrapper-donut">
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
}

export default SpendingBreakdownChart;
