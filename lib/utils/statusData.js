/**
 * Status Data Utilities
 *
 * Functions for fetching status data from both real-time and static sources.
 * Provides fallback mechanisms and unified data interface.
 */

import axios from 'axios';

/**
 * Fetches status data with fallback mechanism
 * First tries the real-time API, then falls back to static data if it fails
 *
 * @param {Object} options - Options for fetching
 * @param {boolean} options.preferStatic - Whether to prefer static data over real-time
 * @param {boolean} options.refresh - Whether to force a refresh of data
 * @returns {Promise<Object>} - Status data
 */
export async function fetchStatusData({ preferStatic = false, refresh = false } = {}) {
  // Define the endpoints
  const realTimeEndpoint = '/api/status';
  const staticEndpoint = '/api/static-status';

  // Choose which endpoint to try first based on preference
  const primaryEndpoint = preferStatic ? staticEndpoint : realTimeEndpoint;
  const fallbackEndpoint = preferStatic ? realTimeEndpoint : staticEndpoint;

  try {
    // Try the primary endpoint first
    const response = await axios.get(primaryEndpoint, {
      params: { refresh },
      timeout: 5000 // 5 second timeout
    });

    return {
      ...response.data,
      source: preferStatic ? 'static' : 'real-time',
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    console.warn(`Failed to fetch from ${primaryEndpoint}, trying fallback`, error.message);

    try {
      // Try the fallback endpoint
      const fallbackResponse = await axios.get(fallbackEndpoint, {
        timeout: 5000 // 5 second timeout
      });

      return {
        ...fallbackResponse.data,
        source: preferStatic ? 'real-time' : 'static',
        fetchedAt: new Date().toISOString(),
        usingFallback: true
      };
    } catch (fallbackError) {
      console.error('Failed to fetch status data from both endpoints', fallbackError.message);
      throw new Error('Failed to fetch status data');
    }
  }
}

/**
 * Fetches historical data for a specific site
 *
 * @param {string} siteId - The ID of the site to fetch history for
 * @returns {Promise<Object>} - Historical data for the site
 */
export async function fetchSiteHistory(siteId) {
  try {
    // First try to get from static data which should have the historical info
    const response = await axios.get('/api/static-status');

    if (response.data && response.data.historical) {
      const { hourly, daily } = response.data.historical;

      // Extract this site's historical data
      const siteHourly = hourly[siteId] || {};
      const siteDaily = daily[siteId] || {};

      // Convert to arrays for easier consumption
      const hourlyData = Object.entries(siteHourly).map(([timestamp, data]) => ({
        timestamp,
        ...data
      })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      const dailyData = Object.entries(siteDaily).map(([date, data]) => ({
        date,
        ...data
      })).sort((a, b) => new Date(a.date) - new Date(b.date));

      return {
        hourlyData,
        dailyData
      };
    }

    // Fallback to real-time API
    const historyResponse = await axios.get(`/api/status`, {
      params: { siteId }
    });

    return historyResponse.data.history || { hourlyData: [], dailyData: [] };
  } catch (error) {
    console.error(`Error fetching history for site ${siteId}:`, error);
    return { hourlyData: [], dailyData: [] };
  }
}

/**
 * Calculates the availability percentage over the last 24 hours
 *
 * @param {Object} historicalData - Historical data for a site
 * @returns {number} - Availability percentage (0-100)
 */
export function calculateAvailability(historicalData) {
  if (!historicalData || !historicalData.hourlyData || historicalData.hourlyData.length === 0) {
    return 100; // Default to 100% if no data
  }

  const hourlyData = historicalData.hourlyData;
  const operationalCount = hourlyData.filter(data =>
    data.status === 'operational'
  ).length;

  return Math.round((operationalCount / hourlyData.length) * 100);
}

/**
 * Formats a timestamp for display
 *
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} - Formatted time string
 */
export function formatTimestamp(timestamp) {
  if (!timestamp) return 'Unknown';

  try {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return timestamp;
  }
}
