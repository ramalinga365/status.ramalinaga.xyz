import React from "react";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Clock,
} from "lucide-react";

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
            <CheckCircle className="h-9 w-9 text-green-500" strokeWidth={2} />
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
            <AlertTriangle
              className="h-9 w-9 text-yellow-500"
              strokeWidth={2}
            />
          ),
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          borderColor: "border-yellow-200 dark:border-yellow-800",
          textColor: "text-yellow-800 dark:text-yellow-100",
        };
      case "outage":
        return {
          title: "System Outage Detected",
          description: "One or more sites are currently unavailable.",
          icon: <XCircle className="h-9 w-9 text-red-500" strokeWidth={2} />,
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800",
          textColor: "text-red-800 dark:text-red-100",
        };
      default:
        return {
          title: "Status Unknown",
          description: "Unable to determine system status.",
          icon: (
            <HelpCircle className="h-9 w-9 text-gray-500" strokeWidth={2} />
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
      className={`rounded-lg border ${statusConfig.borderColor} ${statusConfig.bgColor} p-6 mb-6 shadow-sm transition-all duration-300 hover:shadow-md`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center mb-6 md:mb-0">
          <div className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow-md mb-4 sm:mb-0 sm:mr-5">
            {statusConfig.icon}
          </div>
          <div>
            <h2 className={`text-2xl font-semibold ${statusConfig.textColor}`}>
              {statusConfig.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {statusConfig.description}
            </p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-3">
              <Clock className="h-4 w-4 mr-1" />
              <span>Last checked: {new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-700 rounded-xl h-28 w-28 flex flex-col items-center justify-center shadow-md transform transition-transform hover:scale-105 relative overflow-hidden">
          <div
            className={`absolute inset-x-0 top-0 h-1 ${overallStatus === "operational" ? "bg-green-500" : overallStatus === "degraded" ? "bg-yellow-500" : "bg-red-500"}`}
          ></div>
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {calculateOperationalPercentage()}%
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Operational
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
            {sites.length} sites monitored
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
