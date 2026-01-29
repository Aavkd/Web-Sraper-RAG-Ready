/**
 * CSS selectors for identifying boilerplate elements to remove
 * These elements typically contain navigation, ads, and other non-content noise
 */

/**
 * Selectors for navigation elements
 */
export const NAVIGATION_SELECTORS = [
  'nav',
  'header',
  '[role="navigation"]',
  '[role="banner"]',
  '.navigation',
  '.nav-menu',
  '.navbar',
  '.nav-bar',
  '.main-nav',
  '.main-navigation',
  '.site-nav',
  '.site-navigation',
  '.top-nav',
  '.header-nav',
  '#navigation',
  '#nav',
  '#navbar',
] as const;

/**
 * Selectors for footer elements
 */
export const FOOTER_SELECTORS = [
  'footer',
  '[role="contentinfo"]',
  '.footer',
  '.site-footer',
  '.page-footer',
  '#footer',
] as const;

/**
 * Selectors for sidebar elements
 */
export const SIDEBAR_SELECTORS = [
  'aside',
  '[role="complementary"]',
  '.sidebar',
  '.side-bar',
  '.aside',
  '#sidebar',
] as const;

/**
 * Selectors for cookie consent/banner elements
 */
export const COOKIE_SELECTORS = [
  '.cookie-banner',
  '.cookie-consent',
  '.cookie-notice',
  '.cookie-popup',
  '.cookies-banner',
  '.gdpr-banner',
  '.privacy-banner',
  '#cookie-banner',
  '#cookie-consent',
  '#cookie-notice',
  '[class*="cookie-"]',
  '[id*="cookie-"]',
] as const;

/**
 * Selectors for advertisement elements
 */
export const AD_SELECTORS = [
  '.advertisement',
  '.ads',
  '.ad-container',
  '.ad-wrapper',
  '.ad-slot',
  '.advert',
  '.sponsored',
  '[class*="ad-"]',
  '[class*="ads-"]',
  '[id*="ad-"]',
  '[data-ad]',
  'ins.adsbygoogle',
] as const;

/**
 * Selectors for social sharing elements
 */
export const SOCIAL_SELECTORS = [
  '.social-share',
  '.share-buttons',
  '.social-buttons',
  '.share-links',
  '.social-links',
  '.sharing',
  '.share-this',
  '[class*="social-share"]',
  '[class*="share-button"]',
] as const;

/**
 * Selectors for related content elements
 */
export const RELATED_CONTENT_SELECTORS = [
  '.related-posts',
  '.related-articles',
  '.related-content',
  '.recommended',
  '.you-may-like',
  '.more-stories',
  '.suggested',
  '#related-posts',
] as const;

/**
 * Selectors for comment sections
 */
export const COMMENT_SELECTORS = [
  '.comments',
  '.comment-section',
  '.comments-area',
  '.comment-list',
  '#comments',
  '#disqus_thread',
  '.disqus',
] as const;

/**
 * Selectors for elements that should always be removed
 */
export const ALWAYS_REMOVE_SELECTORS = [
  'script',
  'style',
  'noscript',
  'iframe',
  'svg',
  'canvas',
  'video',
  'audio',
  'form',
  'input',
  'button',
  'select',
  'textarea',
  '[hidden]',
  '[aria-hidden="true"]',
  '.hidden',
  '.sr-only',
  '.visually-hidden',
  '.screen-reader-text',
] as const;

/**
 * Selectors for popup/modal elements
 */
export const POPUP_SELECTORS = [
  '.modal',
  '.popup',
  '.overlay',
  '.lightbox',
  '[role="dialog"]',
  '[aria-modal="true"]',
  '.newsletter-popup',
  '.subscribe-popup',
] as const;

/**
 * All boilerplate selectors combined
 * Used by the HTML cleaner to remove non-content elements
 */
export const ALL_BOILERPLATE_SELECTORS = [
  ...NAVIGATION_SELECTORS,
  ...FOOTER_SELECTORS,
  ...SIDEBAR_SELECTORS,
  ...COOKIE_SELECTORS,
  ...AD_SELECTORS,
  ...SOCIAL_SELECTORS,
  ...RELATED_CONTENT_SELECTORS,
  ...COMMENT_SELECTORS,
  ...ALWAYS_REMOVE_SELECTORS,
  ...POPUP_SELECTORS,
] as const;

/**
 * Generates a combined CSS selector string for querySelectorAll
 * @param selectors - Array of individual selectors
 * @returns Combined selector string
 */
export function createSelectorString(selectors: readonly string[]): string {
  return selectors.join(', ');
}

/**
 * Pre-built selector string for all boilerplate elements
 */
export const BOILERPLATE_SELECTOR_STRING = createSelectorString(ALL_BOILERPLATE_SELECTORS);

/**
 * Selectors for Q&A page elements that should be PRESERVED - Task 2.4
 * These are the main content areas on Q&A sites
 */
export const QA_PRESERVE_SELECTORS = [
  // Stack Overflow / Stack Exchange
  '.question',
  '.answer',
  '.post-text',
  '.s-prose',
  '.postcell',
  '.answercell',
  // Discourse
  '.topic-post',
  '.cooked',
  '.post-body',
  // Generic Q&A
  '.question-content',
  '.answer-content',
  '#question',
  '#answers',
  '[itemprop="text"]',
  '[itemprop="acceptedAnswer"]',
  '[itemprop="suggestedAnswer"]',
] as const;

/**
 * Selectors for Q&A-specific noise elements to REMOVE - Task 2.4
 * These are UI elements that don't contribute to content
 */
export const QA_REMOVE_SELECTORS = [
  // Comments and interactions
  '.comments',
  '.comment-list',
  '#comments',
  '.add-comment',
  '.comment-form',
  // Vote/action elements
  '.vote',
  '.js-vote-count',
  '.post-menu',
  '.js-post-menu',
  '.post-actions',
  // User info cards
  '.user-info',
  '.user-card',
  '.user-action-time',
  '.post-signature',
  '.owner',
  '.avatar',
  // Sharing/social
  '.share-link',
  '.share-tip',
  '[data-controller="share"]',
  // Tags and metadata
  '.post-taglist',
  '.tags',
  '.question-stats',
  // Edit/flag links
  '.edit-post',
  '.flag-post',
  '.js-flag-btn',
  // Notices and banners
  '.notice',
  '.post-notice',
  '.js-post-notice',
  // Related questions
  '.related-questions',
  '.linked-questions',
  '.sidebar-related',
] as const;

/**
 * Pre-built selector string for Q&A elements to preserve
 */
export const QA_PRESERVE_SELECTOR_STRING = createSelectorString(QA_PRESERVE_SELECTORS);

/**
 * Pre-built selector string for Q&A noise elements to remove
 */
export const QA_REMOVE_SELECTOR_STRING = createSelectorString(QA_REMOVE_SELECTORS);

