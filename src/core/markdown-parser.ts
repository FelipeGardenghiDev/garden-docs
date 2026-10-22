/**
 * Safe, zero-dependency Markdown parser for Garden Docs.
 * Translates standard Markdown into styled HTML, including GFM tables.
 */

export function generateMarkdownTable(headers: string[], rows: string[][]): string {
  const headerLine = `| ${headers.join(' | ')} |`;
  const separatorLine = `| ${headers.map(() => '---').join(' | ')} |`;
  const rowLines = rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
  return `\n${headerLine}\n${separatorLine}\n${rowLines}\n`;
}

export function parseMarkdown(md: string): string {
  if (!md) return '';

  const lines = md.split('\n');
  const htmlLines: string[] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Fenced Code Blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        htmlLines.push(
          `<pre class="my-4 p-4 rounded-xl bg-zinc-900 text-emerald-400 font-mono text-xs overflow-x-auto border border-zinc-800"><code>${escapeHtml(
            codeBlockLines.join('\n')
          )}</code></pre>`
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Markdown Table Detection (starts and ends with '|', second line is delimiter row)
    if (
      line.trim().startsWith('|') &&
      line.trim().endsWith('|') &&
      i + 1 < lines.length &&
      lines[i + 1].includes('|') &&
      lines[i + 1].includes('-')
    ) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      i--; // adjust loop counter

      if (tableLines.length >= 2) {
        const parseRow = (rowStr: string) =>
          rowStr
            .replace(/^\|/, '')
            .replace(/\|$/, '')
            .split('|')
            .map((c) => c.trim());

        const headers = parseRow(tableLines[0]);
        const alignments = parseRow(tableLines[1]).map((align) => {
          if (align.startsWith(':') && align.endsWith(':')) return 'text-center';
          if (align.endsWith(':')) return 'text-right';
          return 'text-left';
        });

        const rows = tableLines.slice(2).map(parseRow);

        let tableHtml = `<div class="overflow-x-auto my-4 rounded-xl border border-zinc-800"><table class="w-full text-xs md:text-sm text-zinc-200">`;
        tableHtml += `<thead class="bg-zinc-900 border-b border-zinc-800 text-zinc-100 font-semibold"><tr>`;
        headers.forEach((h, hIdx) => {
          const alignClass = alignments[hIdx] || 'text-left';
          tableHtml += `<th class="px-4 py-2.5 ${alignClass}">${parseInline(h)}</th>`;
        });
        tableHtml += `</tr></thead>`;

        tableHtml += `<tbody class="divide-y divide-zinc-800/60">`;
        rows.forEach((r) => {
          tableHtml += `<tr class="hover:bg-zinc-800/40">`;
          r.forEach((cell, cIdx) => {
            const alignClass = alignments[cIdx] || 'text-left';
            tableHtml += `<td class="px-4 py-2 ${alignClass}">${parseInline(cell)}</td>`;
          });
          tableHtml += `</tr>`;
        });
        tableHtml += `</tbody></table></div>`;

        htmlLines.push(tableHtml);
        continue;
      }
    }

    // Headings
    if (line.startsWith('# ')) {
      htmlLines.push(`<h1 class="text-3xl font-extrabold text-white mt-6 mb-3 tracking-tight">${parseInline(line.substring(2))}</h1>`);
      continue;
    }
    if (line.startsWith('## ')) {
      htmlLines.push(`<h2 class="text-2xl font-bold text-white mt-5 mb-2 tracking-tight border-b border-zinc-800 pb-1">${parseInline(line.substring(3))}</h2>`);
      continue;
    }
    if (line.startsWith('### ')) {
      htmlLines.push(`<h3 class="text-xl font-bold text-white mt-4 mb-2">${parseInline(line.substring(4))}</h3>`);
      continue;
    }
    if (line.startsWith('#### ')) {
      htmlLines.push(`<h4 class="text-lg font-semibold text-zinc-100 mt-3 mb-1">${parseInline(line.substring(5))}</h4>`);
      continue;
    }

    // Horizontal Rule
    if (line.trim() === '---' || line.trim() === '***') {
      htmlLines.push('<hr class="my-6 border-zinc-800" />');
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      htmlLines.push(`<blockquote class="pl-4 my-3 border-l-4 border-emerald-500 text-zinc-300 italic">${parseInline(line.substring(2))}</blockquote>`);
      continue;
    }

    // Unordered list
    if (line.startsWith('- ') || line.startsWith('* ')) {
      htmlLines.push(`<li class="ml-6 list-disc text-zinc-200 my-1">${parseInline(line.substring(2))}</li>`);
      continue;
    }

    // Ordered list
    const numMatch = line.match(/^(\d+)\.\s(.*)/);
    if (numMatch) {
      htmlLines.push(`<li class="ml-6 list-decimal text-zinc-200 my-1">${parseInline(numMatch[2])}</li>`);
      continue;
    }

    // Checkbox lists
    if (line.startsWith('- [ ] ')) {
      htmlLines.push(`<div class="flex items-center gap-2 my-1 text-zinc-300"><input type="checkbox" disabled class="accent-emerald-500 rounded" /> <span>${parseInline(line.substring(6))}</span></div>`);
      continue;
    }
    if (line.startsWith('- [x] ') || line.startsWith('- [X] ')) {
      htmlLines.push(`<div class="flex items-center gap-2 my-1 text-zinc-400 line-through"><input type="checkbox" checked disabled class="accent-emerald-500 rounded" /> <span>${parseInline(line.substring(6))}</span></div>`);
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      htmlLines.push('<div class="h-3"></div>');
      continue;
    }

    // Regular paragraph
    htmlLines.push(`<p class="my-2 leading-relaxed text-zinc-200 text-sm md:text-base">${parseInline(line)}</p>`);
  }

  return htmlLines.join('\n');
}

/**
 * Parses inline formatting: bold, italic, strikethrough, inline code, links
 */
function parseInline(text: string): string {
  let res = escapeHtml(text);

  // Bold and Italic ***text***
  res = res.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');

  // Bold **text**
  res = res.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');

  // Italic *text*
  res = res.replace(/\*(.*?)\*/g, '<em class="italic text-zinc-300">$1</em>');

  // Strikethrough ~~text~~
  res = res.replace(/~~(.*?)~~/g, '<del class="line-through text-zinc-500">$1</del>');

  // Inline code `code`
  res = res.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 font-mono text-xs border border-zinc-700">$1</code>');

  // Markdown links [text](url)
  res = res.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline">$1</a>');

  return res;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function computeStats(text: string): { wordCount: number; charCount: number; readingTimeMin: number } {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const readingTime = Math.max(1, Math.ceil(words / 200)); // 200 words/min average
  return { wordCount: words, charCount: chars, readingTimeMin: readingTime };
}
