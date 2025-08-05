import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/outline';

const SiteMetrics = ({ site }) => {
  // Ensure site data exists
  if (!site) return null;

  const { responseTime, status, statusCode, lastChecked } = site;

  // Determine the health indicator icon and color
  const getHealthIndicator = () => {
    switch (status) {
      case 'operational':
        return {
          icon: <CheckCircleIcon className="h-8 w-8 text-green-500" />,
          text: 'Healthy',
          textColor: 'text-green-500'
        };
      case 'degraded':
        return {
          icon: <ExclamationCircleIcon className="h-8 w-8 text-yellow-500" />,
          text: 'Degraded',
          textColor: 'text-yellow-500'
        };
      case 'outage':
        return {
          icon: <XCircleIcon className="h-8 w-8 text-red-500" />,
          text: 'Outage',
          textColor: 'text-red-500'
        };
      default:
        return {
          icon: <ClockIcon className="h-8 w-8 text-gray-500" />,
          text: 'Unknown',
          textColor: 'text-gray-500'
        };
    }
  };

  // Determine response time indicator
  const getResponseIndicator = (time) => {
    if (!time) return { color: 'bg-gray-200 dark:bg-gray-700', text: 'Unknown' };

    if (time < 200) return { color: 'bg-green-500', text: 'Fast' };
    if (time < 500) return { color: 'bg-blue-500', text: 'Good' };
    if (time < 1000) return { color: 'bg-yellow-500', text: 'Slow' };
    return { color: 'bg-red-500', text: 'Very Slow' };
  };

  const health = getHealthIndicator();
  const responseIndicator = getResponseIndicator(responseTime);

  // Format time
  const formatTime = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Site Metrics
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Health Status */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Health Status</span>
          </div>
          <div className="flex items-center">
            {health.icon}
            <span className={`ml-2 font-semibold ${health.textColor}`}>
              {health.text}
            </span>
          </div>
          {statusCode && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Status Code: {statusCode}
            </div>
          )}
        </div>

        {/* Response Time */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Response Time</span>
          </div>
          <div className="flex items-center">
            <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full ${responseIndicator.color} rounded-full`}
                style={{ width: `${Math.min(100, (responseTime || 0) / 10)}%` }}
              ></div>
            </div>
            <span className="ml-2 font-mono text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-[60px] text-right">
              {responseTime ? `${responseTime}ms` : 'N/A'}
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {responseIndicator.text}
          </div>
        </div>

        {/* Last Checked */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 sm:col-span-2">
          <div className="flex items-center mb-2">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Last Checked</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="ml-2 font-semibold text-gray-700 dark:text-gray-300">
              {formatTime(lastChecked)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteMetrics;
