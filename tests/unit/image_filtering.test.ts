/**
 * Unit tests for image filtering in markdown conversion
 * Tests the images Turndown rule
 */

import { describe, it, expect } from 'vitest';
import { htmlToMarkdown } from '../../src/processing/markdown.js';

describe('Image Filtering', () => {
    it('should remove long base64 data URIs', () => {
        const longBase64 = 'data:image/png;base64,' + 'A'.repeat(200);
        const html = `<p><img alt="Badge Image" src="${longBase64}"></p>`;
        const result = htmlToMarkdown(html);
        expect(result).not.toContain('data:image');
        expect(result).not.toContain('AAAA');
    });

    it('should preserve short data URIs (small SVG icons)', () => {
        const shortDataUri = 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4='; // ~40 chars
        const html = `<p><img alt="Icon" src="${shortDataUri}"></p>`;
        const result = htmlToMarkdown(html);
        expect(result).toContain('![Icon]');
    });

    it('should handle excessively long CDN URLs', () => {
        const longUrl = 'https://cdn.example.com/image.png?' + 'param=value&'.repeat(50);
        const html = `<p><img alt="Product Photo" src="${longUrl}"></p>`;
        const result = htmlToMarkdown(html);
        // Should convert to text reference instead of keeping long URL
        expect(result).toContain('[Image: Product Photo]');
        expect(result).not.toContain(longUrl);
    });

    it('should preserve normal image URLs', () => {
        const html = '<p><img alt="Logo" src="https://example.com/logo.png"></p>';
        const result = htmlToMarkdown(html);
        expect(result).toContain('![Logo](https://example.com/logo.png)');
    });

    it('should remove tracking pixels', () => {
        const html = '<p><img alt="Pixel" src="https://track.example.com/pixel.gif"></p>';
        const result = htmlToMarkdown(html);
        expect(result).not.toContain('track.example.com');
    });
});
