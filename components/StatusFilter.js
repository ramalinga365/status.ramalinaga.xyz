import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Check, X } from "lucide-react";
import StatusPulse from "./StatusPulse";

/**
 * StatusFilter Component
 *
 * Interactive filter for site statuses with smooth animations
 */
const StatusFilter = ({ onFilterChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  // Status options with their respective colors and labels
  const statusOptions = [
    { id: "operational", label: "Operational" },
    { id: "degraded", label: "Degraded" },
    { id: "outage", label: "Outage" },
    { id: "maintenance", label: "Maintenance" },
  ];

  // Toggle the filter dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Toggle a status selection
  const toggleStatus = (statusId) => {
    setSelectedStatuses((prev) => {
      if (prev.includes(statusId)) {
        return prev.filter(id => id !== statusId);
      } else {
        return [...prev, statusId];
      }
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedStatuses([]);
  };

  // Notify parent component when filters change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(selectedStatuses);
    }
  }, [selectedStatuses, onFilterChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e) => {
      if (!e.target.closest('.status-filter')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  return (
    <div className={`status-filter relative ${className}`}>
      <motion.button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Filter className="h-4 w-4" />
        <span>Filter Status</span>
        {selectedStatuses.length > 0 && (
          <span className="flex items-center justify-center w-5 h-5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold">
            {selectedStatuses.length}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-50 mt-2 w-56 right-0 origin-top-right"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black/5 dark:ring-white/10 p-2">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300">Status Filter</h3>
                {selectedStatuses.length > 0 && (
                  <motion.button
                    onClick={clearFilters}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </motion.button>
                )}
              </div>

              <div className="mt-2 space-y-1">
                {statusOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => toggleStatus(option.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors
                      ${selectedStatuses.includes(option.id)
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <StatusPulse status={option.id} size="small" />
                      <span className="ml-2">{option.label}</span>
                    </div>

                    {selectedStatuses.includes(option.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between px-3 py-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    {selectedStatuses.length
                      ? `${selectedStatuses.length} selected`
                      : "All statuses visible"}
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="underline hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatusFilter;
