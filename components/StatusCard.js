import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { motion } from "framer-motion";
import { cardHover, statusBadgeVariants } from "../lib/animations";

dayjs.extend(relativeTime);

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case "operational":
        return {
          className: "status-badge-operational",
          label: "Operational",
        };
      case "degraded":
      case "degraded_performance":
        return {
          className: "status-badge-degraded",
          label: "Degraded Performance",
        };
      case "partial_outage":
        return {
          className: "status-badge-degraded",
          label: "Partial Outage",
        };
      case "major_outage":
        return {
          className: "status-badge-outage",
          label: "Major Outage",
        };
      case "maintenance":
        return {
          className: "status-badge-maintenance",
          label: "Maintenance",
        };
      default:
        return {
          className: "status-badge-unknown",
          label: "Unknown",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <motion.span
      className={`status-badge ${config.className}`}
      initial="initial"
      animate={status.toLowerCase()}
      variants={statusBadgeVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {config.label}
    </motion.span>
  );
};

const StatusCard = ({ service }) => {
  const { name, description, status, lastUpdated, uptime } = service;

  return (
    <motion.div
      className="status-card"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: 10 }}
      whileHover="hover"
      whileTap="tap"
      variants={cardHover}
      layout
    >
      <div className="flex justify-between items-start">
        <div>
          <motion.h3
            className="text-lg font-medium text-gray-900 dark:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {name}
          </motion.h3>
          <motion.p
            className="text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {description}
          </motion.p>
        </div>
        <StatusBadge status={status} />
      </div>

      <motion.div
        className="mt-4 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Uptime:{" "}
            <motion.span
              className="font-medium"
              initial={{ color: "#6B7280" }}
              animate={{
                color:
                  uptime > 99
                    ? "#059669"
                    : uptime > 95
                      ? "#0891B2"
                      : uptime > 90
                        ? "#D97706"
                        : "#DC2626",
              }}
              transition={{ duration: 0.5 }}
            >
              {uptime}%
            </motion.span>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Updated {dayjs(lastUpdated).fromNow()}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatusCard;
