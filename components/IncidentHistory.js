import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const IncidentHistoryItem = ({ incident }) => {
  const { title, date, status, message, resolved, resolvedAt } = incident;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 dark:bg-green-900';
      case 'investigating':
        return 'bg-yellow-100 dark:bg-yellow-900';
      case 'identified':
        return 'bg-blue-100 dark:bg-blue-900';
      case 'monitoring':
        return 'bg-indigo-100 dark:bg-indigo-900';
      case 'critical':
        return 'bg-red-100 dark:bg-red-900';
      default:
        return 'bg-gray-100 dark:bg-black';
    }
  };

  return (
    <div className={`p-4 rounded-lg mb-4 ${resolved ? 'bg-gray-50 dark:bg-dark-lighter' : getStatusColor(status)}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {dayjs(date).format('MMMM D, YYYY [at] h:mm A')}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          resolved
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
          : `bg-${status.toLowerCase()}-100 text-${status.toLowerCase()}-800 dark:bg-${status.toLowerCase()}-900 dark:text-${status.toLowerCase()}-100`
        }`}>
          {resolved ? 'Resolved' : status}
        </span>
      </div>
      <div className="mt-2">
        <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
      </div>
      {resolved && (
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Resolved {dayjs(resolvedAt).fromNow()}
        </div>
      )}
    </div>
  );
};

const IncidentHistory = ({ incidents }) => {
  const sortedIncidents = [...incidents].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="bg-white dark:bg-dark-lighter shadow-sm rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Incident History</h2>

      {sortedIncidents.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No incidents reported in the last 90 days.</p>
      ) : (
        <div>
          {sortedIncidents.map((incident, index) => (
            <IncidentHistoryItem key={index} incident={incident} />
          ))}
        </div>
      )}
    </div>
  );
};

export default IncidentHistory;
