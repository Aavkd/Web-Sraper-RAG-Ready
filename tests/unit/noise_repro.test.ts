import { describe, it, expect } from 'vitest';
import { removeNoiseSections } from '../../src/processing/markdown.js';

describe('Noise Removal Remediation', () => {
    it('should remove Wikipedia citation back-link lines starting with **^**', () => {
        const input = `
# Valid Content
This is valid text.

**^** See, for example, the Feynman Lectures on Physics.
^ Another citation style.

More valid text.
    `.trim();

        const result = removeNoiseSections(input);

        expect(result).not.toContain('**^**');
        expect(result).not.toContain('Feynman Lectures');
        expect(result).not.toContain('^ Another citation');
        expect(result).toContain('Valid Content');
    });
});
