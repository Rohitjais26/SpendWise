// frontend-vite/src/components/SpendingChart.jsx

import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function SpendingChart({ data, type }) {
    if (!data || data.length === 0) {
        return <p className="text-gray-500 text-center p-4">No financial data recorded to build this chart yet.</p>;
    }

    // --- Pie Chart for Spending by Category ---
    if (type === 'category') {
        const chartData = {
            labels: data.map(item => item._id),
            datasets: [
                {
                    data: data.map(item => item.total),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#4B77BE'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#4B77BE']
                }
            ]
        };
        const chartOptions = { responsive: true, plugins: { legend: { position: 'right' } } };
        return <Pie data={chartData} options={chartOptions} />;
    }

    // --- Bar Chart for Monthly Trend ---
    if (type === 'monthly') {
        const labels = data.map(item => item._id);
        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Income',
                    data: data.map(item => item.income),
                    backgroundColor: '#4BC0C0',
                },
                {
                    label: 'Expense',
                    data: data.map(item => item.expense * -1), // Display expense as a negative number for balance visualization
                    backgroundColor: '#FF6384',
                },
            ],
        };
        const chartOptions = {
            responsive: true,
            scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: false, }
            },
            plugins: {
                tooltip: { mode: 'index', intersect: false },
                title: { display: false }
            }
        };
        return <Bar data={chartData} options={chartOptions} />;
    }

    return <div>Invalid chart type specified.</div>;
}

export default SpendingChart;