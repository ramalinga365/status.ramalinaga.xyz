import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'operational':
        return {
          className: 'status-badge-operational',
          label: 'Operational'
        };
      case 'degraded':
      case 'degraded_performance':
        return {
          className: 'status-badge-degraded',
          label: 'Degraded Performance'
        };
      case 'partial_outage':
        return {
          className: 'status-badge-degraded',
          label: 'Partial Outage'
        };
      case 'major_outage':
        return {
          className: 'status-badge-outage',
          label: 'Major Outage'
        };
      case 'maintenance':
        return {
          className: 'status-badge-maintenance',
          label: 'Maintenance'
        };
      default:
        return {
          className: 'status-badge-unknown',
          label: 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  );
};

const StatusCard = ({ service }) => {
  const { name, description, status, lastUpdated, uptime } = service;

  return (
    <div className="status-card">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Uptime: <span className="font-medium">{uptime}%</span>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Updated {dayjs(lastUpdated).fromNow()}
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
