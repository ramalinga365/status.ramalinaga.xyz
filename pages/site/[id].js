import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SiteMetrics from '../../components/SiteMetrics';
import HistoricalChart from '../../components/HistoricalChart';
import { getSiteHistory } from '../../lib/services/statusChecker';
import { initializeDarkMode, toggleDarkMode } from '../../lib/utils';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import axios from 'axios';

export default function SiteDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [darkMode, setDarkMode] = useState(false);
  const [site, setSite] = useState(null);
  const [siteHistory, setSiteHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize dark mode preference
  useEffect(() => {
    setDarkMode(initializeDarkMode());
  }, []);

  // Fetch site data when id is available
  useEffect(() => {
    if (!id) return;

    const fetchSiteData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch site status from API
        const response = await axios.get(`/api/status?siteId=${id}`);
        setSite(response.data.site);

        // Get historical data (currently simulated)
        const history = getSiteHistory(id);
        setSiteHistory(history);
      } catch (err) {
        console.error('Error fetching site data:', err);
        setError('Failed to load site data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSiteData();

    // Refresh data every 30 seconds
    const refreshInterval = setInterval(fetchSiteData, 30000);
    return () => clearInterval(refreshInterval);
  }, [id]);

  // Handle dark mode toggle
  const handleToggleDarkMode = () => {
    toggleDarkMode(setDarkMode);
  };

  if (!id) {
    return null; // Don't render until we have an ID
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <Head>
        <title>{site ? `${site.name} Status - ProDevOpsGuy` : 'Loading Site Status...'}</title>
        <meta name="description" content={site ? `Current status and performance metrics for ${site.name}` : 'Loading site status information'} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <Header toggleTheme={handleToggleDarkMode} isDarkMode={darkMode} />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Status Dashboard
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
              {error}
            </div>
          ) : site ? (
            <>
              {/* Site Header */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{site.icon}</span>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {site.name}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                      {site.description}
                    </p>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm inline-block mt-2"
                    >
                      {site.url}
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Site Metrics */}
                <div className="lg:col-span-1">
                  <SiteMetrics site={site} />
                </div>

                {/* Historical Chart */}
                <div className="lg:col-span-2">
                  <HistoricalChart
                    siteHistory={siteHistory}
                    siteId={id}
                    siteName={site.name}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-yellow-800 dark:text-yellow-200">
              Site not found
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
