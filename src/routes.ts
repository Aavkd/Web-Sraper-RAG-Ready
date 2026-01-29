/**
 * Route configuration for the crawler
 * Defines routing rules and priorities for different URL patterns
 */

import type { ActorInput } from './types/index.js';
import { shouldCrawlUrl } from './crawler/utils.js';

/**
 * Route labels for different types of pages
 */
export const RouteLabels = {
  /** Default content page route */
  DEFAULT: 'DEFAULT',
  /** Skipped pages (external, binary, etc.) */
  SKIP: 'SKIP',
} as const;

export type RouteLabel = (typeof RouteLabels)[keyof typeof RouteLabels];

/**
 * Determines the route label for a given URL
 * Used to direct requests to appropriate handlers
 */
export function getRouteLabel(
  url: string,
  startUrl: string,
  input: ActorInput,
): RouteLabel {
  const result = shouldCrawlUrl(
    url,
    startUrl,
    input.includePaths,
    input.excludePaths,
  );
  
  if (!result.shouldCrawl) {
    return RouteLabels.SKIP;
  }
  
  return RouteLabels.DEFAULT;
}

/**
 * Route configuration object
 * Can be extended for more specific routing (e.g., blog posts vs docs)
 */
export interface RouteConfig {
  /** URL pattern matcher (glob or regex) */
  pattern: string;
  /** Handler label to use */
  label: RouteLabel;
  /** Priority (higher = matched first) */
  priority: number;
}

/**
 * Default routing configuration
 * Routes are matched in priority order
 */
export function getDefaultRoutes(): RouteConfig[] {
  return [
    // Default catch-all route
    {
      pattern: '**/*',
      label: RouteLabels.DEFAULT,
      priority: 0,
    },
  ];
}

/**
 * URL priority hints for crawl order
 * Higher priority URLs are crawled first
 */
export function getUrlPriority(url: string): number {
  const pathname = new URL(url).pathname.toLowerCase();
  
  // Documentation pages often have higher value
  if (pathname.includes('/docs') || pathname.includes('/documentation')) {
    return 10;
  }
  
  // API reference pages
  if (pathname.includes('/api') || pathname.includes('/reference')) {
    return 8;
  }
  
  // Guide/tutorial pages
  if (pathname.includes('/guide') || pathname.includes('/tutorial')) {
    return 8;
  }
  
  // Blog posts
  if (pathname.includes('/blog') || pathname.includes('/articles')) {
    return 5;
  }
  
  // Landing/marketing pages (usually less valuable for knowledge extraction)
  if (pathname === '/' || pathname.includes('/pricing') || pathname.includes('/contact')) {
    return 2;
  }
  
  // Default priority
  return 5;
}
