import React from "react";
import { RefreshCw, Clock } from "lucide-react";

const RefreshButton = ({ onRefresh, lastUpdated, isRefreshing }) => {
  const handleRefresh = async () => {
    if (isRefreshing) return;

    try {
      await onRefresh();
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  // Format time nicely
  const formatTime = (date) => {
    if (!date) return "Never";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-lg shadow-sm text-white transition-all duration-200 ${
          isRefreshing
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        }`}
        aria-label="Refresh status data"
      >
        {isRefreshing ? (
          <>
            <RefreshCw className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
            Refreshing...
          </>
        ) : (
          <>
            <RefreshCw className="-ml-1 mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Refresh
          </>
        )}
      </button>
      {lastUpdated && (
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
          <span>Last updated: {formatTime(lastUpdated)}</span>
        </span>
      )}
    </div>
  );
};

export default RefreshButton;
