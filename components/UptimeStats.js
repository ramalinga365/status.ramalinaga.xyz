import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const UptimeStats = ({ services }) => {
  // Calculate overall uptime percentage
  const calculateOverallUptime = () => {
    if (!services || services.length === 0) return 100;

    const totalUptime = services.reduce((sum, service) => sum + parseFloat(service.uptime), 0);
    return (totalUptime / services.length).toFixed(2);
  };

  // Prepare data for the chart
  const prepareChartData = () => {
    // Last 30 days labels
    const labels = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    // Generate simulated uptime data for demonstration
    // In a real application, this would come from your monitoring service
    const datasets = services.map((service, index) => {
      // Generate random uptime data that generally stays high (90-100%)
      const data = Array.from({ length: 30 }, () => {
        // Base the random data on the service's reported uptime
        const baseUptime = parseFloat(service.uptime);
        // Random variation but weighted toward the service's baseline uptime
        return Math.min(100, Math.max(70, baseUptime - (Math.random() * 10) + (Math.random() * 5)));
      });

      // Color palette for the lines
      const colors = [
        'rgba(59, 130, 246, 0.5)', // Blue
        'rgba(16, 185, 129, 0.5)', // Green
        'rgba(245, 158, 11, 0.5)', // Yellow
        'rgba(239, 68, 68, 0.5)',  // Red
        'rgba(107, 114, 128, 0.5)' // Gray
      ];

      return {
        label: service.name,
        data: data,
        borderColor: colors[index % colors.length].replace('0.5', '1'),
        backgroundColor: colors[index % colors.length],
        tension: 0.4,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
      };
    });

    return {
      labels,
      datasets,
    };
  };

  const chartData = prepareChartData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2) + '%';
            }
            return label;
          }
        }
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
        min: 70,
        max: 100,
        ticks: {
          color: 'rgb(var(--foreground-rgb))',
          stepSize: 5,
          callback: function(value) {
            return value + '%';
          }
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'nearest',
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        hoverRadius: 8,
      },
    },
  };

  const overallUptime = calculateOverallUptime();

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 md:mb-0">
          Uptime Performance
        </h2>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 flex items-center">
          <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">Overall Uptime:</span>
          <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">{overallUptime}%</span>
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        30-day rolling average uptime for all services
      </p>

      <div className="h-80">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default UptimeStats;
