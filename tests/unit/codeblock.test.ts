/**
 * Unit tests for code block extraction
 * Tests the interactiveCodeBlocks Turndown rule
 */

import { describe, it, expect } from 'vitest';
import { htmlToMarkdown } from '../../src/processing/markdown.js';

describe('Code Block Handling', () => {
  describe('Interactive Code Blocks', () => {
    it('should handle Stripe-style tokenized spans as single code block', () => {
      const html = `
        <div class="CodeBlock">
          <span class="token punctuation">{</span>
          <span class="token property">"id"</span>
          <span class="token punctuation">:</span>
          <span class="token string">"tok_123"</span>
          <span class="token punctuation">}</span>
        </div>
      `;

      const result = htmlToMarkdown(html);

      // Should be a single fenced code block, not fragmented inline code
      expect(result).toContain('```');
      // Check key content elements are present (textContent may include whitespace)
      expect(result).toContain('{');
      expect(result).toContain('"id"');
      expect(result).toContain('"tok_123"');
      expect(result).toContain('}');
      // Should NOT have multiple inline code backticks
      const inlineCodeCount = (result.match(/`[^`\n]+`/g) || []).length;
      expect(inlineCodeCount).toBeLessThan(3);
    });

    it('should handle Prism.js highlighted code', () => {
      const html = `
        <pre class="language-javascript">
          <code class="language-javascript">
            <span class="token keyword">const</span>
            <span class="token constant">x</span>
            <span class="token operator">=</span>
            <span class="token number">42</span>
            <span class="token punctuation">;</span>
          </code>
        </pre>
      `;

      const result = htmlToMarkdown(html);

      expect(result).toContain('```javascript');
      expect(result).toContain('const');
      expect(result).toContain('42');
      expect(result).toContain('```');
    });

    it('should handle Shiki highlighted code', () => {
      const html = `
        <pre class="shiki" style="background-color:#1e1e1e">
          <code>
            <span style="color:#569CD6">function</span>
            <span style="color:#DCDCAA"> hello</span>
            <span style="color:#D4D4D4">()</span>
            <span style="color:#D4D4D4"> {</span>
            <span style="color:#D4D4D4">}</span>
          </code>
        </pre>
      `;

      const result = htmlToMarkdown(html);

      expect(result).toContain('```');
      expect(result).toContain('function');
      expect(result).toContain('hello');
    });

    it('should handle hljs (highlight.js) code blocks', () => {
      const html = `
        <pre><code class="hljs language-python">
          <span class="hljs-keyword">def</span>
          <span class="hljs-title function_">greet</span>
          <span class="hljs-params">(name)</span>:
          <span class="hljs-built_in">print</span>
          <span class="hljs-string">"Hello"</span>
        </code></pre>
      `;

      const result = htmlToMarkdown(html);

      expect(result).toContain('```');
      expect(result).toContain('def');
      expect(result).toContain('greet');
    });

    it('should detect language from class name', () => {
      const html = `
        <div class="code-block language-typescript">
          <span>const x: number = 1;</span>
        </div>
      `;

      const result = htmlToMarkdown(html);

      expect(result).toContain('```typescript');
      expect(result).toContain('const x: number = 1');
    });

    it('should handle pre > code with many spans', () => {
      const html = `
        <pre>
          <code>
            <span>line1</span>
            <span>line2</span>
            <span>line3</span>
            <span>line4</span>
            <span>line5</span>
          </code>
        </pre>
      `;

      const result = htmlToMarkdown(html);

      // Should be extracted as a code block
      expect(result).toContain('```');
      expect(result).toContain('line1');
      expect(result).toContain('line5');
    });

    it('should handle nested code blocks gracefully', () => {
      const html = `
        <div class="CodeBlock">
          <div class="code-toolbar">
            <pre class="language-json"><code>{"key": "value"}</code></pre>
          </div>
        </div>
      `;

      const result = htmlToMarkdown(html);

      expect(result).toContain('```');
      expect(result).toContain('key');
      expect(result).toContain('value');
    });

    it('should preserve multi-line code formatting', () => {
      const html = `
        <div class="highlight">
          <pre><code>function test() {
  return true;
}</code></pre>
        </div>
      `;

      const result = htmlToMarkdown(html);

      expect(result).toContain('```');
      expect(result).toContain('function test()');
      expect(result).toContain('return true');
    });

    it('should not fragment JSON code', () => {
      const html = `
        <div class="CodeBlock language-json">
          <span>{</span>
          <span>"payment_intent"</span>
          <span>:</span>
          <span>"pi_123abc"</span>
          <span>,</span>
          <span>"amount"</span>
          <span>:</span>
          <span>1000</span>
          <span>}</span>
        </div>
      `;

      const result = htmlToMarkdown(html);

      expect(result).toContain('```json');
      // Check it's not fragmented with many inline code blocks
      const fencedBlockMatch = result.match(/```json[\s\S]*?```/);
      expect(fencedBlockMatch).toBeTruthy();

      // The content should be in a single code block
      if (fencedBlockMatch) {
        expect(fencedBlockMatch[0]).toContain('payment_intent');
        expect(fencedBlockMatch[0]).toContain('pi_123abc');
        expect(fencedBlockMatch[0]).toContain('amount');
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty code blocks', () => {
      const html = `<div class="CodeBlock"></div>`;

      const result = htmlToMarkdown(html);

      // Empty code blocks should be removed
      expect(result.trim()).toBe('');
    });

    it('should handle code blocks with only whitespace', () => {
      const html = `<div class="CodeBlock">   \n\t  </div>`;

      const result = htmlToMarkdown(html);

      expect(result.trim()).toBe('');
    });

    it('should preserve normal inline code', () => {
      const html = `<p>Use the <code>console.log()</code> function to debug.</p>`;

      const result = htmlToMarkdown(html);

      // Normal inline code should still work
      expect(result).toContain('`console.log()`');
    });

    it('should not affect regular pre blocks without complex spans', () => {
      const html = `<pre><code>simple code here</code></pre>`;

      const result = htmlToMarkdown(html);

      expect(result).toContain('simple code here');
    });
  });
  describe('Language Detection from Classes', () => {
    it('should detect language from brush: syntax', () => {
      const html = '<pre class="brush: python"><code>print("hello")</code></pre>';
      const result = htmlToMarkdown(html);
      expect(result).toContain('```python');
    });

    it('should detect language from nested code element', () => {
      const html = '<pre><code class="language-ruby">puts "hello"</code></pre>';
      const result = htmlToMarkdown(html);
      expect(result).toContain('```ruby');
    });

    it('should detect language from parent pre element', () => {
      const html = '<pre class="language-go"><code>fmt.Println("hello")</code></pre>';
      const result = htmlToMarkdown(html);
      expect(result).toContain('```go');
    });

    it('should fallback to content detection when no class', () => {
      const html = '<pre><code>SELECT * FROM users;</code></pre>';
      const result = htmlToMarkdown(html);
      expect(result).toContain('```sql');
    });

    it('should handle DevOps/config languages', () => {
      const html = '<pre class="language-dockerfile"><code>FROM node:18</code></pre>';
      const result = htmlToMarkdown(html);
      expect(result).toContain('```dockerfile');
    });

    it('should handle GraphQL', () => {
      const html = '<pre class="lang-graphql"><code>query { user { name } }</code></pre>';
      const result = htmlToMarkdown(html);
      expect(result).toContain('```graphql');
    });
  });
});
