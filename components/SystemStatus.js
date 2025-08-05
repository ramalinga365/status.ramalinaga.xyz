import React from "react";

const SystemStatus = ({ sites }) => {
  // Calculate overall system status based on all sites
  const calculateOverallStatus = () => {
    if (!sites || sites.length === 0) return "operational";

    // Count sites by status
    const statusCounts = sites.reduce((counts, site) => {
      const status = site.status.toLowerCase();
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    }, {});

    // Determine overall status based on the most severe status
    if (statusCounts["outage"] > 0) {
      return "outage";
    } else if (statusCounts["degraded"] > 0) {
      return "degraded";
    } else {
      return "operational";
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "operational":
        return {
          title: "All Systems Operational",
          description: "All sites are up and running normally.",
          icon: (
            <svg
              className="h-8 w-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-800",
          textColor: "text-green-800 dark:text-green-100",
        };
      case "degraded":
        return {
          title: "Degraded Performance",
          description: "Some sites are experiencing performance issues.",
          icon: (
            <svg
              className="h-8 w-8 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          ),
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          borderColor: "border-yellow-200 dark:border-yellow-800",
          textColor: "text-yellow-800 dark:text-yellow-100",
        };
      case "outage":
        return {
          title: "System Outage Detected",
          description: "One or more sites are currently unavailable.",
          icon: (
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800",
          textColor: "text-red-800 dark:text-red-100",
        };
      default:
        return {
          title: "Status Unknown",
          description: "Unable to determine system status.",
          icon: (
            <svg
              className="h-8 w-8 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          bgColor: "bg-gray-50 dark:bg-gray-800",
          borderColor: "border-gray-200 dark:border-gray-700",
          textColor: "text-gray-800 dark:text-gray-100",
        };
    }
  };

  const overallStatus = calculateOverallStatus();
  const statusConfig = getStatusConfig(overallStatus);

  // Calculate operational percentage
  const calculateOperationalPercentage = () => {
    if (!sites || sites.length === 0) return 100;

    const operationalCount = sites.filter(
      (site) => site.status === "operational",
    ).length;
    return Math.round((operationalCount / sites.length) * 100);
  };

  return (
    <div
      className={`rounded-lg border ${statusConfig.borderColor} ${statusConfig.bgColor} p-6 mb-6`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          {statusConfig.icon}
          <div className="ml-4">
            <h2 className={`text-2xl font-semibold ${statusConfig.textColor}`}>
              {statusConfig.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {statusConfig.description}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Last checked: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-700 rounded-full h-24 w-24 flex flex-col items-center justify-center shadow-md">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {calculateOperationalPercentage()}%
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Operational
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
