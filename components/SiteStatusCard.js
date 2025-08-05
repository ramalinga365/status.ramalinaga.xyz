import React from "react";
import Link from "next/link";

const SiteStatusCard = ({ site }) => {
  const {
    name,
    description,
    url,
    icon,
    status,
    statusText,
    lastChecked,
    responseTime,
  } = site;

  const getStatusClasses = (status) => {
    switch (status) {
      case "operational":
        return {
          badge:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
          icon: "text-green-500",
          border: "border-green-200 dark:border-green-700",
        };
      case "degraded":
        return {
          badge:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
          icon: "text-yellow-500",
          border: "border-yellow-200 dark:border-yellow-700",
        };
      case "outage":
        return {
          badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
          icon: "text-red-500",
          border: "border-red-200 dark:border-red-700",
        };
      default:
        return {
          badge:
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
          icon: "text-gray-500",
          border: "border-gray-200 dark:border-gray-700",
        };
    }
  };

  const statusClasses = getStatusClasses(status);
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-5 flex flex-col border-l-4 ${statusClasses.border} transition-all duration-300 hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{icon}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusClasses.badge}`}
        >
          {statusText}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex space-x-4">
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Visit Site
          </Link>
          <Link
            href={`/site/${site.id}`}
            className="text-green-600 dark:text-green-400 hover:underline font-medium"
          >
            View Details
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-500 dark:text-gray-400">
            {responseTime}ms
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            Last checked: {formatTime(lastChecked)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SiteStatusCard;
