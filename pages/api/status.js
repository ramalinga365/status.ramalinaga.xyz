// API route for fetching site status data in real-time
// Uses the statusChecker service to check website availability

import {
  checkSiteStatus,
  checkAllSites,
  calculateSystemHealth,
} from "../../lib/services/statusChecker";

// Define the list of sites to monitor
const sitesConfig = [
  {
    id: "projects",
    name: "Real-Time Projects Hub",
    description: "Hands-on DevOps projects from beginner to advanced",
    url: "https://projects.prodevopsguytech.com",
    icon: "💻",
  },
  {
    id: "docs",
    name: "Ultimate Docs Portal",
    description: "900+ curated DevOps learning materials",
    url: "https://docs.prodevopsguytech.com",
    icon: "📚",
  },
  {
    id: "repos",
    name: "Repositories Central",
    description: "Collection of scripts, infrastructure code & prep content",
    url: "https://repos.prodevopsguytech.com",
    icon: "📦",
  },
  {
    id: "jobs",
    name: "Jobs Portal",
    description: "Find your next DevOps career opportunity",
    url: "https://jobs.prodevopsguytech.com",
    icon: "🧭",
  },
  {
    id: "blog",
    name: "DevOps Blog",
    description: "Deep dives into DevOps practices & tutorials",
    url: "https://blog.prodevopsguytech.com",
    icon: "📰",
  },
  {
    id: "cloud",
    name: "Cloud Blog",
    description: "Cloud architecture & implementation guides",
    url: "https://cloud.prodevopsguytech.com",
    icon: "☁️",
  },
  {
    id: "docker2k8s",
    name: "Docker to Kubernetes",
    description: "Master containerization journey",
    url: "https://dockertokubernetes.live",
    icon: "🐳",
  },
  {
    id: "devopslab",
    name: "DevOps Engineering Lab",
    description: "Hands-on CI/CD & automation",
    url: "https://www.devops-engineering.site",
    icon: "🔬",
  },
  {
    id: "toolguides",
    name: "DevOps Tool Guides",
    description: "Setup & installation guides",
    url: "https://www.devopsguides.site",
    icon: "🛠️",
  },
  {
    id: "cheatsheet",
    name: "DevOps Cheatsheet",
    description: "Comprehensive tools & practices",
    url: "https://cheatsheet.prodevopsguytech.com",
    icon: "📑",
  },
];

// Cache the status results to prevent excessive requests
let cachedResults = null;
let lastChecked = null;
const CACHE_DURATION = 30000; // 30 seconds

export default async function handler(req, res) {
  // Check if we need to refresh the cache
  const now = new Date();
  const shouldRefreshCache =
    !cachedResults || !lastChecked || now - lastChecked > CACHE_DURATION;

  // Return the requested data
  const { siteId, refresh } = req.query;

  // Force refresh if requested
  const forceRefresh = refresh === "true";

  try {
    // For individual site checks
    if (siteId) {
      const siteConfig = sitesConfig.find((s) => s.id === siteId);

      if (!siteConfig) {
        return res.status(404).json({ error: "Site not found" });
      }

      // Check if we can use cached data for this site
      if (!forceRefresh && cachedResults && !shouldRefreshCache) {
        const cachedSite = cachedResults.find((s) => s.id === siteId);
        if (cachedSite) {
          return res.status(200).json({ site: cachedSite });
        }
      }

      // If not in cache or forcing refresh, check the site status in real-time
      const siteStatus = await checkSiteStatus(siteConfig);

      return res.status(200).json({ site: siteStatus });
    }

    // For all sites
    if (forceRefresh || shouldRefreshCache) {
      // Check all sites in parallel
      cachedResults = await checkAllSites(sitesConfig);
      lastChecked = new Date();
    }

    // Calculate overall system health metrics
    const healthMetrics = calculateSystemHealth(cachedResults);

    // Return all sites with health metrics
    return res.status(200).json({
      timestamp: new Date(),
      overall: healthMetrics.status,
      metrics: healthMetrics,
      sites: cachedResults,
      lastChecked,
    });
  } catch (error) {
    console.error("Error in status API:", error);
    return res.status(500).json({
      error: "Failed to check site status",
      message: error.message,
    });
  }
}
