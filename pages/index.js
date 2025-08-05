import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SystemStatus from "../components/SystemStatus";
import SiteStatusCard from "../components/SiteStatusCard";
import RefreshButton from "../components/RefreshButton";
import { initializeDarkMode, toggleDarkMode } from "../lib/utils";
import { fetchStatusData } from "../lib/utils/statusData";
import {
  CheckCircle,
  Clock,
  Server,
  AlertTriangle,
  XCircle,
  BarChart2,
  RefreshCw,
  Activity,
} from "lucide-react";
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

      // Fetch site statuses with fallback to static data if real-time fails
      const data = await fetchStatusData({
        preferStatic: false,
        refresh: forceRefresh,
      });

      // Save current sites for comparison
      if (sites.length > 0) {
        setPreviousSites([...sites]);
      }

      const newSites = data.sites;
      setSites(newSites);
      setMetrics(data.metrics);
      setLastUpdated(new Date(data.timestamp || Date.now()));

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
            icon: <CheckCircle className="h-5 w-5" strokeWidth={2} />,
            duration: 8000,
          });
        } else if (newSite.status === "degraded") {
          notification.warning(
            `${newSite.name} is experiencing degraded performance`,
            {
              icon: <AlertTriangle className="h-5 w-5" strokeWidth={2} />,
              duration: 10000,
            },
          );
        } else if (newSite.status === "outage") {
          notification.error(`${newSite.name} is currently down`, {
            icon: <XCircle className="h-5 w-5" strokeWidth={2} />,
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
    <div
      className={`min-h-screen flex flex-col ${darkMode ? "dark" : ""} transition-colors duration-300`}
    >
      <Head>
        <title>ProDevOpsGuy - Status Dashboard</title>
        <meta
          name="description"
          content="Real-time status of ProDevOpsGuy Tech platforms and websites"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <Header toggleTheme={handleToggleDarkMode} isDarkMode={darkMode} />

      <main className="flex-grow py-4 sm:py-8 px-3 sm:px-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            // Loading state
            <div className="flex justify-center items-center h-48 sm:h-64">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* System Status Overview */}
              <SystemStatus sites={sites} />

              {/* System Metrics */}
              {metrics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  {/* Operational Percentage */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 flex items-center">
                    <div className="bg-green-100 dark:bg-green-900/20 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                      <CheckCircle
                        className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400"
                        strokeWidth={2}
                      />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Operational
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {metrics.operationalPercentage}%
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        {metrics.totalSites} monitored sites
                      </p>
                    </div>
                  </div>

                  {/* Average Response Time */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                      <Clock
                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400"
                        strokeWidth={2}
                      />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Avg Response Time
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {metrics.averageResponseTime} ms
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        For operational sites
                      </p>
                    </div>
                  </div>

                  {/* Sites with Issues */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 flex items-center">
                    <div className="bg-red-100 dark:bg-red-900/20 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                      <Server
                        className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-400"
                        strokeWidth={2}
                      />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Sites with Issues
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {metrics.sitesWithIssues.length}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        {metrics.sitesWithIssues.length
                          ? "Requires attention"
                          : "All systems operational"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sites Status List */}
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
                  <div className="flex items-center mb-3 sm:mb-0">
                    <BarChart2
                      className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400 mr-2"
                      strokeWidth={2}
                    />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                      Site Status
                    </h2>
                  </div>
                  <div className="flex flex-col items-end">
                    <RefreshButton
                      onRefresh={() => fetchData(true)}
                      lastUpdated={lastUpdated}
                      isRefreshing={refreshing}
                    />
                    {metrics && metrics.source && (
                      <div className="flex items-center text-xs text-gray-400 mt-1.5">
                        {metrics.source === "static" ? (
                          <Server className="h-3 w-3 mr-1" />
                        ) : (
                          <Activity className="h-3 w-3 mr-1" />
                        )}
                        <span>
                          Source:{" "}
                          {metrics.source === "static"
                            ? "Static data"
                            : "Real-time check"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:gap-5">
                  {sites.length > 0 ? (
                    sites.map((site, index) => (
                      <SiteStatusCard
                        key={site.id}
                        site={site}
                        className={
                          index % 2 === 0
                            ? "transform hover:-translate-y-1"
                            : "transform hover:translate-y-1"
                        }
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <RefreshCw className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500 mb-3 sm:mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 text-center text-base sm:text-lg">
                        No sites found.
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-center text-xs sm:text-sm mt-1">
                        Try refreshing or check back later
                      </p>
                    </div>
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
