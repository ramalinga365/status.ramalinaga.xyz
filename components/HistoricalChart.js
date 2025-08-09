import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const HistoricalChart = ({ siteHistory, siteId, siteName }) => {
  const [timeRange, setTimeRange] = useState('24h');

  if (!siteHistory) {
    return (
      <div className="bg-white dark:bg-dark-lighter rounded-lg shadow p-4 flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-gray-400">
          No historical data available
        </p>
      </div>
    );
  }

  const { hourlyData, dailyData } = siteHistory;

  const prepareChartData = () => {
    if (timeRange === '24h') {
      // Prepare data for the last 24 hours
      const labels = hourlyData.map(data =>
        new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );

      const responseTimeData = hourlyData.map(data => data.responseTime);

      const statusColorData = hourlyData.map(data => {
        switch (data.status) {
          case 'operational':
            return 'rgba(16, 185, 129, 0.2)'; // Green
          case 'degraded':
            return 'rgba(245, 158, 11, 0.2)'; // Yellow
          case 'outage':
            return 'rgba(239, 68, 68, 0.2)'; // Red
          default:
            return 'rgba(107, 114, 128, 0.2)'; // Gray
        }
      });

      return {
        labels,
        datasets: [
          {
            label: 'Response Time (ms)',
            data: responseTimeData,
            borderColor: 'rgba(59, 130, 246, 1)', // Blue
            backgroundColor: statusColorData,
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: hourlyData.map(data => {
              switch (data.status) {
                case 'operational': return 'rgb(16, 185, 129)'; // Green
                case 'degraded': return 'rgb(245, 158, 11)'; // Yellow
                case 'outage': return 'rgb(239, 68, 68)'; // Red
                default: return 'rgb(107, 114, 128)'; // Gray
              }
            })
          }
        ]
      };
    } else {
      // Prepare data for the last 30 days
      const labels = dailyData.map(data =>
        new Date(data.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })
      );

      return {
        labels,
        datasets: [
          {
            label: 'Response Time (ms)',
            data: dailyData.map(data => data.avgResponseTime),
            borderColor: 'rgba(59, 130, 246, 1)', // Blue
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            yAxisID: 'y',
            tension: 0.4,
            fill: true,
            borderWidth: 2,
            pointRadius: 2,
          },
          {
            label: 'Uptime (%)',
            data: dailyData.map(data => data.uptime),
            borderColor: 'rgba(16, 185, 129, 1)', // Green
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            yAxisID: 'y1',
            tension: 0.4,
            fill: true,
            borderWidth: 2,
            pointRadius: 2,
          }
        ]
      };
    }
  };

  const chartData = prepareChartData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          padding: 20,
          color: 'rgb(var(--foreground-rgb))'
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#111827',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(var(--foreground-rgb))',
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 0,
        title: {
          display: true,
          text: 'Response Time (ms)',
          color: 'rgb(var(--foreground-rgb))',
        },
        ticks: {
          color: 'rgb(var(--foreground-rgb))',
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
      },
      ...(timeRange === '30d' ? {
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          min: 98.5,
          max: 100,
          title: {
            display: true,
            text: 'Uptime (%)',
            color: 'rgb(var(--foreground-rgb))',
          },
          ticks: {
            color: 'rgb(var(--foreground-rgb))',
          },
          grid: {
            drawOnChartArea: false,
          },
        }
      } : {})
    },
  };

  return (
    <div className="bg-white dark:bg-dark-lighter rounded-lg shadow p-3 sm:p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
          {siteName} - Historical Performance
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('24h')}
            className={`px-3 py-1 text-sm rounded-full ${
              timeRange === '24h'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-dark-light text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            24 Hours
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1 text-sm rounded-full ${
              timeRange === '30d'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-dark-light text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>
      <div className="h-48 sm:h-64">
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        {timeRange === '24h' ? (
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
              <span>Operational</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
              <span>Degraded</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
              <span>Outage</span>
            </div>
          </div>
        ) : (
          <p>30-day historical data showing average response times and uptime percentage</p>
        )}
      </div>
    </div>
  );
};

export default HistoricalChart;
