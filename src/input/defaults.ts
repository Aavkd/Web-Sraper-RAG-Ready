/**
 * Default configuration values for the Actor
 * These are applied when optional input fields are not provided
 */
export const DEFAULT_VALUES = {
  /** Maximum pages to crawl */
  maxPages: 20,

  /** Maximum link depth from start URL */
  maxDepth: 2,

  /** Path patterns to include (empty = include all) */
  includePaths: [] as string[],

  /** Path patterns to exclude */
  excludePaths: [] as string[],

  /** Target chunk size in tokens */
  chunkSize: 600,

  /** Default output format */
  outputFormat: 'json' as const,

  /** Enable content chunking for RAG by default */
  enableChunking: true,

  /** Strip References/Bibliography sections by default */
  stripReferences: true,
} as const;

/**
 * Chunk size recommendations for different use cases
 */
export const CHUNK_SIZE_PRESETS = {
  /** For embeddings with smaller context windows */
  small: 300,

  /** Default - balanced for most RAG use cases */
  medium: 600,

  /** For models with larger context windows */
  large: 1000,

  /** Maximum reasonable chunk size */
  xlarge: 1500,
} as const;

/**
 * Approximate characters per token for estimation
 * This is a rough estimate; actual tokenization varies by model
 */
export const CHARS_PER_TOKEN = 4;

/**
 * File extensions to skip (binary/non-content files)
 */
export const SKIP_EXTENSIONS = [
  '.pdf',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.svg',
  '.ico',
  '.mp3',
  '.mp4',
  '.avi',
  '.mov',
  '.wmv',
  '.zip',
  '.tar',
  '.gz',
  '.rar',
  '.7z',
  '.exe',
  '.dmg',
  '.js',
  '.css',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.map',
] as const;

/**
 * Common paths to exclude by default (can be overridden)
 */
export const COMMON_EXCLUDE_PATHS = [
  '/api/*',
  '/admin/*',
  '/login*',
  '/logout*',
  '/auth/*',
  '/cart*',
  '/checkout*',
  '/account/*',
] as const;
