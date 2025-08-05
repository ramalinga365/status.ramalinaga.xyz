/**
 * Static Status API Endpoint
 *
 * This API route serves the static JSON status data that's generated
 * by the GitHub Actions workflow. This provides a fallback when the
 * real-time status checking might be too resource-intensive or unavailable.
 */

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Get the path to the static data file
    const dataFilePath = path.join(process.cwd(), 'public', 'status-data.json');

    // Check if the file exists
    if (!fs.existsSync(dataFilePath)) {
      return res.status(404).json({
        error: 'Status data not found',
        message: 'The status data file has not been generated yet. Please wait for the scheduled job to run.'
      });
    }

    // Read the file content
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    const statusData = JSON.parse(fileContent);

    // Add cache control headers to allow caching for a short period
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=120'); // 1 minute browser cache, 2 minute CDN cache

    // Return the parsed data
    return res.status(200).json({
      ...statusData,
      source: 'static',
      servedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error serving static status data:', error);
    return res.status(500).json({
      error: 'Failed to serve static status data',
      message: error.message
    });
  }
}
