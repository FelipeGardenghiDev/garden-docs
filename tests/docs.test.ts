import { describe, it, expect } from 'vitest';
import { parseMarkdown, computeStats, generateMarkdownTable } from '../src/core/markdown-parser';

describe('Garden Docs - Markdown Parser Engine', () => {
  it('parses headings into proper HTML tags', () => {
    const md = '# Title\n## Subtitle\n### Section';
    const html = parseMarkdown(md);

    expect(html).toContain('<h1');
    expect(html).toContain('Title</h1>');
    expect(html).toContain('<h2');
    expect(html).toContain('Subtitle</h2>');
    expect(html).toContain('<h3');
    expect(html).toContain('Section</h3>');
  });

  it('parses inline bold, italic, and code', () => {
    const md = 'This is **bold** and *italic* and `code`.';
    const html = parseMarkdown(md);

    expect(html).toContain('<strong class="font-bold text-white">bold</strong>');
    expect(html).toContain('<em class="italic text-zinc-300">italic</em>');
    expect(html).toContain('<code');
    expect(html).toContain('code</code>');
  });

  it('parses blockquotes and lists', () => {
    const md = '> Note quote\n\n- Item 1\n- Item 2';
    const html = parseMarkdown(md);

    expect(html).toContain('<blockquote');
    expect(html).toContain('Note quote</blockquote>');
    expect(html).toContain('<li class="ml-6 list-disc');
    expect(html).toContain('Item 1</li>');
  });

  it('parses GitHub Flavored Markdown tables with alignments', () => {
    const tableMd = `
| Nome | Preço | Status |
| :--- | :---: | ---: |
| Item A | R$ 50 | Ativo |
| Item B | R$ 120 | Pendente |
`.trim();

    const html = parseMarkdown(tableMd);
    expect(html).toContain('<table');
    expect(html).toContain('<thead');
    expect(html).toContain('<tbody');
    expect(html).toContain('Nome');
    expect(html).toContain('Item A');
    expect(html).toContain('text-center');
    expect(html).toContain('text-right');
  });

  it('generates formatted markdown table template', () => {
    const generated = generateMarkdownTable(['A', 'B'], [['1', '2']]);
    expect(generated).toContain('| A | B |');
    expect(generated).toContain('| --- | --- |');
    expect(generated).toContain('| 1 | 2 |');
  });

  it('computes accurate word, character counts and reading time', () => {
    const sample = 'One two three four five six seven eight nine ten.';
    const stats = computeStats(sample);

    expect(stats.wordCount).toBe(10);
    expect(stats.charCount).toBe(sample.length);
    expect(stats.readingTimeMin).toBe(1);
  });
});
