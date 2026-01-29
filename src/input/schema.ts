import { z } from 'zod';
import type { ActorInput } from '../types/index.js';
import { DEFAULT_VALUES } from './defaults.js';

/**
 * Zod schema for validating Actor input at runtime
 */
export const ActorInputSchema = z.object({
  startUrl: z
    .string()
    .url({ message: 'startUrl must be a valid URL' })
    .refine(
      (url) => url.startsWith('http://') || url.startsWith('https://'),
      { message: 'startUrl must use http or https protocol' },
    ),

  maxPages: z
    .number()
    .int()
    .min(1, 'maxPages must be at least 1')
    .max(500, 'maxPages cannot exceed 500')
    .default(DEFAULT_VALUES.maxPages),

  maxDepth: z
    .number()
    .int()
    .min(1, 'maxDepth must be at least 1')
    .max(10, 'maxDepth cannot exceed 10')
    .default(DEFAULT_VALUES.maxDepth),

  includePaths: z
    .array(z.string())
    .default(DEFAULT_VALUES.includePaths),

  excludePaths: z
    .array(z.string())
    .default(DEFAULT_VALUES.excludePaths),

  chunkSize: z
    .number()
    .int()
    .min(100, 'chunkSize must be at least 100 tokens')
    .max(2000, 'chunkSize cannot exceed 2000 tokens')
    .default(DEFAULT_VALUES.chunkSize),

  outputFormat: z
    .enum(['json', 'markdown', 'both'])
    .default(DEFAULT_VALUES.outputFormat),

  enableChunking: z
    .boolean()
    .default(DEFAULT_VALUES.enableChunking),
});

/**
 * Parse and validate raw input, applying defaults where needed
 * @param rawInput - The raw input object from Actor.getInput()
 * @returns Validated and typed ActorInput
 * @throws ZodError if validation fails
 */
export function parseAndValidateInput(rawInput: unknown): ActorInput {
  // Handle null/undefined input
  if (!rawInput || typeof rawInput !== 'object') {
    throw new Error('Input is required and must be an object');
  }

  const result = ActorInputSchema.parse(rawInput);
  return result;
}

/**
 * Safe version that returns validation errors instead of throwing
 */
export function safeParseInput(rawInput: unknown): {
  success: boolean;
  data?: ActorInput;
  error?: z.ZodError;
} {
  if (!rawInput || typeof rawInput !== 'object') {
    return {
      success: false,
      error: new z.ZodError([
        {
          code: 'custom',
          message: 'Input is required and must be an object',
          path: [],
        },
      ]),
    };
  }

  const result = ActorInputSchema.safeParse(rawInput);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
