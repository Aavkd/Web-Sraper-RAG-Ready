/**
 * Content quality validation
 * Validates extracted content and flags suspicious patterns
 * Phase 4 of the implementation plan
 */

import { estimateTokens } from './tokenizer.js';

/**
 * Types of content quality issues
 */
export type ContentIssue =
    | { type: 'too_short'; threshold: number; actual: number }
    | { type: 'fragmented_code'; fragmentCount: number }
    | { type: 'mostly_code'; codeRatio: number }
    | { type: 'repeated_content'; repetitionScore: number }
    | { type: 'likely_navigation'; navScore: number };

/**
 * Result of content quality validation
 */
export interface ContentQualityReport {
    /** Whether the content passes quality checks */
    isValid: boolean;
    /** Estimated token count */
    tokensExtracted: number;
    /** List of quality issues found */
    issues: ContentIssue[];
    /** Overall quality score (0-100) */
    qualityScore: number;
}

/**
 * Options for content validation
 */
export interface ValidationOptions {
    /** Minimum tokens required for valid content (default: 100) */
    minTokens?: number;
    /** Maximum acceptable code ratio (default: 0.9) */
    maxCodeRatio?: number;
    /** Minimum tokens to trigger code ratio check (default: 200) */
    codeRatioMinTokens?: number;
    /** Maximum inline code fragments before flagging (default: line count * 0.8) */
    fragmentedCodeThreshold?: number;
}

const DEFAULT_OPTIONS: Required<ValidationOptions> = {
    minTokens: 100,
    maxCodeRatio: 0.9,
    codeRatioMinTokens: 200,
    fragmentedCodeThreshold: 0.8, // As a ratio of line count
};

/**
 * Validates the quality of extracted markdown content
 * 
 * @param markdown - The markdown content to validate
 * @param options - Validation options
 * @returns Content quality report
 */
export function validateContent(
    markdown: string,
    options: ValidationOptions = {},
): ContentQualityReport {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const issues: ContentIssue[] = [];
    let qualityScore = 100;

    // Estimate tokens
    const tokens = estimateTokens(markdown);

    // Check 1: Content length
    if (tokens < opts.minTokens) {
        issues.push({ type: 'too_short', threshold: opts.minTokens, actual: tokens });
        qualityScore -= 40;
    }

    // Check 2: Fragmented code (many consecutive inline codes)
    // This is a sign of broken code block extraction (like Stripe's tokenized spans)
    const inlineCodePattern = /`[^`\n]+`/g;
    const inlineCodeMatches = markdown.match(inlineCodePattern) || [];
    const inlineCodeCount = inlineCodeMatches.length;
    const lineCount = markdown.split('\n').length;

    if (lineCount > 0 && inlineCodeCount > lineCount * opts.fragmentedCodeThreshold) {
        issues.push({ type: 'fragmented_code', fragmentCount: inlineCodeCount });
        qualityScore -= 30;
    }

    // Check 3: Code ratio (too much code, too little explanation)
    if (tokens >= opts.codeRatioMinTokens) {
        const codeBlockPattern = /```[\s\S]*?```/g;
        const codeBlockMatches = markdown.match(codeBlockPattern) || [];
        const codeLength = codeBlockMatches.reduce((sum, block) => sum + block.length, 0);
        const codeRatio = markdown.length > 0 ? codeLength / markdown.length : 0;

        if (codeRatio > opts.maxCodeRatio) {
            issues.push({ type: 'mostly_code', codeRatio });
            qualityScore -= 15;
        }
    }

    // Check 4: Repeated content (sign of template/boilerplate)
    const repetitionScore = calculateRepetitionScore(markdown);
    if (repetitionScore > 0.5) {
        issues.push({ type: 'repeated_content', repetitionScore });
        qualityScore -= 20;
    }

    // Check 5: Navigation-like content (lots of short lines, bullets)
    const navScore = calculateNavigationScore(markdown);
    if (navScore > 0.7) {
        issues.push({ type: 'likely_navigation', navScore });
        qualityScore -= 25;
    }

    // Ensure score doesn't go below 0
    qualityScore = Math.max(0, qualityScore);

    return {
        isValid: issues.length === 0,
        tokensExtracted: tokens,
        issues,
        qualityScore,
    };
}

/**
 * Calculates a repetition score based on repeated phrases
 * Returns a value between 0 and 1, where higher means more repetition
 */
function calculateRepetitionScore(markdown: string): number {
    // Split into sentences/phrases
    const phrases = markdown
        .split(/[.!?\n]/)
        .map(p => p.trim().toLowerCase())
        .filter(p => p.length > 10); // Only consider meaningful phrases

    if (phrases.length < 3) {
        return 0;
    }

    // Count phrase occurrences
    const counts = new Map<string, number>();
    for (const phrase of phrases) {
        counts.set(phrase, (counts.get(phrase) || 0) + 1);
    }

    // Calculate repetition ratio
    const repeated = Array.from(counts.values()).filter(c => c > 1).length;
    return repeated / phrases.length;
}

/**
 * Calculates a navigation score based on content patterns
 * Returns a value between 0 and 1, where higher means more nav-like
 */
function calculateNavigationScore(markdown: string): number {
    const lines = markdown.split('\n').filter(l => l.trim());

    if (lines.length < 5) {
        return 0;
    }

    let navSignals = 0;

    // Signal 1: Many short lines (< 50 chars)
    const shortLines = lines.filter(l => l.length < 50).length;
    if (shortLines / lines.length > 0.7) {
        navSignals++;
    }

    // Signal 2: Many list items
    const listItems = lines.filter(l => /^[-*+]|\d+\./.test(l.trim())).length;
    if (listItems / lines.length > 0.5) {
        navSignals++;
    }

    // Signal 3: Many links
    const linkPattern = /\[.+?\]\(.+?\)/g;
    const linkCount = (markdown.match(linkPattern) || []).length;
    if (linkCount > lines.length * 0.5) {
        navSignals++;
    }

    // Signal 4: Lack of paragraphs (text between list items)
    const paragraphs = markdown.split(/\n{2,}/).filter(p =>
        !p.trim().startsWith('-') &&
        !p.trim().startsWith('*') &&
        p.trim().length > 100
    ).length;
    if (paragraphs < 2) {
        navSignals++;
    }

    return navSignals / 4;
}

/**
 * Quick validation check - returns true if content appears valid
 * Use this for fast checks without full report generation
 */
export function isContentValid(markdown: string, minTokens: number = 100): boolean {
    const tokens = estimateTokens(markdown);
    if (tokens < minTokens) {
        return false;
    }

    // Quick fragmented code check
    const inlineCodeCount = (markdown.match(/`[^`\n]+`/g) || []).length;
    const lineCount = markdown.split('\n').length;
    if (lineCount > 0 && inlineCodeCount > lineCount * 0.8) {
        return false;
    }

    return true;
}

/**
 * Determines if content should trigger a Playwright retry
 * Based on quality issues that suggest JavaScript rendering failed
 */
export function shouldRetryWithPlaywright(report: ContentQualityReport): boolean {
    // Trigger retry for these specific issues
    const retryTriggers = ['too_short', 'fragmented_code'];

    return report.issues.some(issue => retryTriggers.includes(issue.type));
}
