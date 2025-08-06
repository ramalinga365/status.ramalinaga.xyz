import React from "react";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, pulseAnimation, scaleUp } from "../lib/animations";

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
    <motion.div
      className={`rounded-lg border ${statusConfig.borderColor} ${statusConfig.bgColor} p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm`}
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: 10 }}
      whileHover={{
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        transition: { duration: 0.3 },
      }}
      layout
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6 md:mb-0">
          <motion.div
            className="p-2 sm:p-3 bg-white dark:bg-gray-700 rounded-xl shadow-md mb-3 sm:mb-0 sm:mr-5"
            variants={scaleUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {statusConfig.icon}
          </motion.div>
          <motion.div variants={scaleUp}>
            <motion.h2
              className={`text-xl sm:text-2xl font-semibold ${statusConfig.textColor}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              {statusConfig.title}
            </motion.h2>
            <motion.p
              className="text-sm text-gray-600 dark:text-gray-300 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {statusConfig.description}
            </motion.p>
            <motion.div
              className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span>Last checked: {new Date().toLocaleString()}</span>
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          className="bg-white dark:bg-gray-700 rounded-xl h-24 w-24 sm:h-28 sm:w-28 flex flex-col items-center justify-center shadow-md relative overflow-hidden"
          variants={pulseAnimation}
          initial="initial"
          animate="animate"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className={`absolute inset-x-0 top-0 h-1`}
            initial={{ width: "0%" }}
            animate={{
              width: "100%",
              backgroundColor:
                overallStatus === "operational"
                  ? "#10B981"
                  : overallStatus === "degraded"
                    ? "#F59E0B"
                    : "#EF4444",
            }}
            transition={{ duration: 0.8 }}
          ></motion.div>
          <motion.span
            className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.3,
            }}
          >
            {calculateOperationalPercentage()}%
          </motion.span>
          <motion.span
            className="text-xs text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Operational
          </motion.span>
          <motion.span
            className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 sm:mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {sites.length} sites monitored
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SystemStatus;
