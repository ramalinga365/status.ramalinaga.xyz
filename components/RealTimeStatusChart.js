import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Activity, Clock, RefreshCw } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

/**
 * RealTimeStatusChart Component
 *
 * A dynamic chart for visualizing real-time and historical status data
 * with smooth animations and responsive design
 */
const RealTimeStatusChart = ({
  siteId = "",
  siteName = "Unknown Site",
  className = "",
  timeRange = "24h", // Options: 1h, 24h, 7d, 30d
}) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const chartRef = useRef(null);

  // Generate mock data based on time range
  const generateData = (range) => {
    const now = new Date();
    const data = [];
    const labels = [];

    // Configure time intervals based on range
    let points = 24;
    let intervalMinutes = 60; // Default 1 hour steps for 24h view
    let format = "HH:mm";

    switch (range) {
      case "1h":
        points = 12;
        intervalMinutes = 5;
        format = "HH:mm";
        break;
      case "7d":
        points = 7;
        intervalMinutes = 60 * 24; // Daily
        format = "MMM DD";
        break;
      case "30d":
        points = 30;
        intervalMinutes = 60 * 24; // Daily
        format = "MMM DD";
        break;
      default: // 24h
        points = 24;
        intervalMinutes = 60;
        format = "HH:mm";
    }

    // Generate random response time data with realistic patterns
    let baseResponseTime = Math.floor(Math.random() * 100) + 150; // Base between 150-250ms
    let currentResponseTime = baseResponseTime;
    let hasOutage = Math.random() > 0.8; // 20% chance of having an outage
    let outagePoint = hasOutage ? Math.floor(Math.random() * points) : -1;

    for (let i = points; i >= 0; i--) {
      const time = new Date(now.getTime() - i * intervalMinutes * 60 * 1000);

      // Format the label based on the time range
      const label = formatDate(time, format);
      labels.push(label);

      // Simulate response time variations
      // If at outage point, set to null to break the line
      if (i === outagePoint) {
        data.push(null);
      } else {
        // Add some random variation to response time
        let variation = Math.random() * 40 - 20; // +/- 20ms

        // Occasionally add a spike
        if (Math.random() > 0.9) {
          variation += Math.random() * 100;
        }

        // Update current response time with some "memory" of previous value
        currentResponseTime = Math.max(
          50,
          currentResponseTime * 0.7 + (baseResponseTime + variation) * 0.3,
        );
        data.push(Math.round(currentResponseTime));
      }
    }

    return { labels, data };
  };

  // Simple date formatter
  const formatDate = (date, format) => {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][d.getMonth()];

    if (format === "HH:mm") {
      return `${hours}:${minutes}`;
    } else {
      return `${month} ${day}`;
    }
  };

  // Load chart data
  const loadChartData = (range) => {
    setLoading(true);

    // Simulate API call with timeout
    setTimeout(() => {
      const { labels, data } = generateData(range);

      const chartData = {
        labels,
        datasets: [
          {
            label: "Response Time (ms)",
            data: data,
            fill: true,
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(59, 130, 246, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(59, 130, 246, 1)",
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.4,
            spanGaps: true, // Connect the line across null values (outages)
          },
        ],
      };

      setChartData(chartData);
      setLoading(false);
    }, 800);
  };

  // Refresh chart data
  const refreshData = () => {
    setRefreshing(true);
    loadChartData(selectedTimeRange);
    setTimeout(() => setRefreshing(false), 800);
  };

  // Change time range
  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
    loadChartData(range);
  };

  // Initial data load
  useEffect(() => {
    if (siteId) {
      loadChartData(selectedTimeRange);

      // Setup auto-refresh every 30 seconds for 1h view, 5 minutes for other views
      const interval = setInterval(
        () => {
          if (selectedTimeRange === "1h") {
            refreshData();
          }
        },
        selectedTimeRange === "1h" ? 30000 : 300000,
      );

      return () => clearInterval(interval);
    }
  }, [selectedTimeRange, siteId]);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(156, 163, 175, 0.05)",
        },
        ticks: {
          color: "rgb(156, 163, 175)",
          callback: (value) => `${value}ms`,
        },
        title: {
          display: true,
          text: "Response Time",
          color: "rgb(156, 163, 175)",
        },
      },
      x: {
        grid: {
          color: "rgba(156, 163, 175, 0.05)",
        },
        ticks: {
          color: "rgb(156, 163, 175)",
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleColor: "rgb(243, 244, 246)",
        bodyColor: "rgb(243, 244, 246)",
        borderColor: "rgba(107, 114, 128, 0.5)",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            return `${siteName} - ${tooltipItems[0].label}`;
          },
          label: (context) => {
            if (context.raw === null) return "Outage Detected";
            return `Response Time: ${context.raw}ms`;
          },
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    elements: {
      line: {
        cubicInterpolationMode: "monotone",
      },
    },
  };

  // Time range options
  const timeRanges = [
    { value: "1h", label: "1 Hour" },
    { value: "24h", label: "24 Hours" },
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
  ];

  return (
    <motion.div
      className={`bg-white dark:bg-black rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100 dark:border-gray-900 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Activity className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
            {siteName || "Site"} Performance
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3" />
            <span>Updated {new Date().toLocaleTimeString()}</span>
          </div>
          <motion.button
            onClick={refreshData}
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={loading || refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </motion.button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        {timeRanges.map((range) => (
          <motion.button
            key={range.value}
            onClick={() => handleTimeRangeChange(range.value)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors
              ${
                selectedTimeRange === range.value
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "bg-gray-100 text-gray-700 dark:bg-dark-light dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {range.label}
          </motion.button>
        ))}
      </div>

      <div className="relative h-64 sm:h-80">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : chartData ? (
          <Line ref={chartRef} data={chartData} options={chartOptions} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
            No data available
          </div>
        )}
      </div>

      {/* Stats summary */}
      {!loading &&
        chartData &&
        chartData.datasets &&
        chartData.datasets[0] &&
        chartData.datasets[0].data && (
          <motion.div
            className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-3 sm:mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gray-50 dark:bg-dark-light/30 rounded-lg p-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Avg
              </div>
              <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                {Math.round(
                  chartData.datasets[0].data
                    .filter((v) => v !== null && v !== undefined)
                    .reduce((a, b) => a + b, 0) /
                    Math.max(
                      1,
                      chartData.datasets[0].data.filter(
                        (v) => v !== null && v !== undefined,
                      ).length,
                    ),
                )}
                ms
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-dark-light/30 rounded-lg p-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Min
              </div>
              <div className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
                {chartData.datasets[0].data.filter(
                  (v) => v !== null && v !== undefined,
                ).length > 0
                  ? Math.min(
                      ...chartData.datasets[0].data.filter(
                        (v) => v !== null && v !== undefined,
                      ),
                    )
                  : 0}
                ms
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-dark-light/30 rounded-lg p-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Max
              </div>
              <div className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400">
                {chartData.datasets[0].data.filter(
                  (v) => v !== null && v !== undefined,
                ).length > 0
                  ? Math.max(
                      ...chartData.datasets[0].data.filter(
                        (v) => v !== null && v !== undefined,
                      ),
                    )
                  : 0}
                ms
              </div>
            </div>
          </motion.div>
        )}
    </motion.div>
  );
};

export default RealTimeStatusChart;
