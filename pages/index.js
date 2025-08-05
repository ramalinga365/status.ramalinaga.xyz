import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SystemStatus from "../components/SystemStatus";
import SiteStatusCard from "../components/SiteStatusCard";
import RefreshButton from "../components/RefreshButton";
import { initializeDarkMode, toggleDarkMode } from "../lib/utils";
import axios from "axios";
import {
  CheckCircleIcon,
  ClockIcon,
  ServerIcon,
  ExclamationIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import { useNotification } from "../components/Notification";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [sites, setSites] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [previousSites, setPreviousSites] = useState([]);
  const notification = useNotification();

  // Initialize dark mode preference
  useEffect(() => {
    setDarkMode(initializeDarkMode());
  }, []);

  // Fetch site status data
  const fetchData = async (forceRefresh = false) => {
    try {
      if (!sites.length) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      // Fetch site statuses from our API with real-time data
      const response = await axios.get(
        `/api/status${forceRefresh ? "?refresh=true" : ""}`,
      );

      // Save current sites for comparison
      if (sites.length > 0) {
        setPreviousSites([...sites]);
      }

      const newSites = response.data.sites;
      setSites(newSites);
      setMetrics(response.data.metrics);
      setLastUpdated(new Date(response.data.timestamp || Date.now()));

      // Check for status changes and notify
      if (previousSites.length > 0 && newSites.length > 0) {
        checkForStatusChanges(previousSites, newSites);
      }
    } catch (error) {
      console.error("Failed to fetch status data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Setup periodic refresh (every 60 seconds)
    const refreshInterval = setInterval(fetchData, 60000);

    return () => clearInterval(refreshInterval);
  }, []);

  // Check for status changes and display notifications
  const checkForStatusChanges = (oldSites, newSites) => {
    newSites.forEach((newSite) => {
      const oldSite = oldSites.find((site) => site.id === newSite.id);
      if (oldSite && oldSite.status !== newSite.status) {
        // Status changed - show notification
        if (
          newSite.status === "operational" &&
          oldSite.status !== "operational"
        ) {
          notification.success(`${newSite.name} is now operational`, {
            icon: <CheckCircleIcon className="h-5 w-5" />,
            duration: 8000,
          });
        } else if (newSite.status === "degraded") {
          notification.warning(
            `${newSite.name} is experiencing degraded performance`,
            {
              icon: <ExclamationIcon className="h-5 w-5" />,
              duration: 10000,
            },
          );
        } else if (newSite.status === "outage") {
          notification.error(`${newSite.name} is currently down`, {
            icon: <XCircleIcon className="h-5 w-5" />,
            duration: 0, // Won't auto-dismiss
          });
        }
      }
    });
  };

  // Handle dark mode toggle
  const handleToggleDarkMode = () => {
    toggleDarkMode(setDarkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "dark" : ""}`}>
      <Head>
        <title>ProDevOpsGuy - Status Dashboard</title>
        <meta
          name="description"
          content="Real-time status of ProDevOpsGuy Tech platforms and websites"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header toggleTheme={handleToggleDarkMode} isDarkMode={darkMode} />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            // Loading state
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* System Status Overview */}
              <SystemStatus sites={sites} />

              {/* System Metrics */}
              {metrics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Operational Percentage */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
                    <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full mr-4">
                      <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Operational
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {metrics.operationalPercentage}%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {metrics.totalSites} monitored sites
                      </p>
                    </div>
                  </div>

                  {/* Average Response Time */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full mr-4">
                      <ClockIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Avg Response Time
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {metrics.averageResponseTime} ms
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        For operational sites
                      </p>
                    </div>
                  </div>

                  {/* Sites with Issues */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
                    <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full mr-4">
                      <ServerIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Sites with Issues
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {metrics.sitesWithIssues.length}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {metrics.sitesWithIssues.length
                          ? "Requires attention"
                          : "All systems operational"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sites Status List */}
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">
                    Site Status
                  </h2>
                  <RefreshButton
                    onRefresh={() => fetchData(true)}
                    lastUpdated={lastUpdated}
                    isRefreshing={refreshing}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {sites.length > 0 ? (
                    sites.map((site) => (
                      <SiteStatusCard key={site.id} site={site} />
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No sites found.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
