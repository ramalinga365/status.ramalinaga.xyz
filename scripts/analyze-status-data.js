/**
 * Status Data Analysis Utility
 *
 * This script analyzes the status data file to provide insights into:
 * - File size
 * - Historical data retention
 * - Data structure
 * - Summary statistics
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DATA_FILE_PATH = path.join(__dirname, '../public/status-data.json');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Format file size to human-readable format
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Count historical data entries
 */
function countHistoricalEntries(historical) {
  const dailyEntries = { total: 0, byDate: {} };
  const hourlyEntries = { total: 0, byHour: {} };

  // Count daily entries
  Object.keys(historical.daily || {}).forEach(siteId => {
    Object.keys(historical.daily[siteId] || {}).forEach(dateKey => {
      dailyEntries.total++;
      dailyEntries.byDate[dateKey] = (dailyEntries.byDate[dateKey] || 0) + 1;
    });
  });

  // Count hourly entries
  Object.keys(historical.hourly || {}).forEach(siteId => {
    Object.keys(historical.hourly[siteId] || {}).forEach(hourKey => {
      hourlyEntries.total++;
      hourlyEntries.byHour[hourKey] = (hourlyEntries.byHour[hourKey] || 0) + 1;
    });
  });

  return { dailyEntries, hourlyEntries };
}

/**
 * Main analysis function
 */
function analyzeStatusData() {
  console.log(`${colors.bright}${colors.cyan}Status Data Analysis Utility${colors.reset}\n`);

  try {
    // Check if the file exists
    if (!fs.existsSync(DATA_FILE_PATH)) {
      console.log(`${colors.red}Error: Status data file not found at ${DATA_FILE_PATH}${colors.reset}`);
      return;
    }

    // Read and parse the file
    const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    const data = JSON.parse(fileContent);

    // Get file stats
    const stats = fs.statSync(DATA_FILE_PATH);
    const fileSize = stats.size;
    const lastModified = stats.mtime;

    // Basic file information
    console.log(`${colors.bright}File Information:${colors.reset}`);
    console.log(`Path: ${DATA_FILE_PATH}`);
    console.log(`Size: ${formatFileSize(fileSize)}`);
    console.log(`Last Modified: ${lastModified}`);
    console.log(`Last Status Check: ${new Date(data.timestamp).toLocaleString()}`);
    console.log();

    // Status summary
    console.log(`${colors.bright}Status Summary:${colors.reset}`);
    console.log(`Overall Status: ${data.overall}`);
    console.log(`Operational Sites: ${data.metrics.operationalPercentage}%`);
    console.log(`Total Sites: ${data.metrics.totalSites}`);
    console.log(`Average Response Time: ${data.metrics.averageResponseTime}ms`);

    if (data.metrics.sitesWithIssues && data.metrics.sitesWithIssues.length > 0) {
      console.log(`\n${colors.yellow}Sites with Issues:${colors.reset}`);
      data.metrics.sitesWithIssues.forEach(site => {
        console.log(`- ${site.name}: ${site.status} (${site.statusText})`);
      });
    }
    console.log();

    // Historical data analysis
    console.log(`${colors.bright}Historical Data Analysis:${colors.reset}`);

    if (!data.historical) {
      console.log(`${colors.red}No historical data found in the file.${colors.reset}`);
      return;
    }

    const { dailyEntries, hourlyEntries } = countHistoricalEntries(data.historical);

    // Daily data summary
    console.log(`${colors.green}Daily Data:${colors.reset}`);
    console.log(`Total Daily Entries: ${dailyEntries.total}`);
    console.log('Days Covered:');
    Object.keys(dailyEntries.byDate).sort().forEach(date => {
      console.log(`  - ${date}: ${dailyEntries.byDate[date]} site entries`);
    });
    console.log();

    // Hourly data summary
    console.log(`${colors.green}Hourly Data:${colors.reset}`);
    console.log(`Total Hourly Entries: ${hourlyEntries.total}`);
    console.log('Hours Covered:');
    Object.keys(hourlyEntries.byHour).sort().forEach(hour => {
      const date = new Date(hour);
      console.log(`  - ${hour}: ${hourlyEntries.byHour[hour]} site entries`);
    });

    // Data size estimate
    console.log(`\n${colors.bright}Storage Analysis:${colors.reset}`);
    console.log(`Historical Data Size Estimate: ~${formatFileSize(JSON.stringify(data.historical).length)}`);
    console.log(`Sites Data Size Estimate: ~${formatFileSize(JSON.stringify(data.sites).length)}`);
    console.log(`Metrics Data Size Estimate: ~${formatFileSize(JSON.stringify(data.metrics).length)}`);

    // Retention recommendations
    if (Object.keys(dailyEntries.byDate).length > 7) {
      console.log(`\n${colors.yellow}Recommendation:${colors.reset} Consider reducing daily history retention (currently > 7 days)`);
    }

    if (Object.keys(hourlyEntries.byHour).length > 24) {
      console.log(`${colors.yellow}Recommendation:${colors.reset} Consider reducing hourly history retention (currently > 24 hours)`);
    }

  } catch (error) {
    console.error(`${colors.red}Error analyzing status data:${colors.reset}`, error);
  }
}

// Run the analysis
analyzeStatusData();
