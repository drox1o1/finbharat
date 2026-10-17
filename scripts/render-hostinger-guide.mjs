import { mkdir, readFile, writeFile } from 'node:fs/promises';

const source = await readFile('docs/hostinger-implementation.md', 'utf8');
const logo = Buffer.from(await readFile('public/brand/logo-brand.svg')).toString('base64');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const inline = value => {
  const tokens = [];
  const protectedText = value.replace(/`([^`]+)`|\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g, (_match, code, label, url) => {
    tokens.push(code !== undefined ? `<code>${escape(code)}</code>` : `<a href="${escape(url)}">${escape(label)}</a>`);
    return `\uE000${tokens.length - 1}\uE000`;
  });
  return escape(protectedText).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\uE000(\d+)\uE000/g, (_match, index) => tokens[Number(index)]);
};
const lines = source.split('\n');
const sections = [];
const body = [];
const block = line => /^(#{1,3} |```|\||[-*] |\d+\. )/.test(line);
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;
  if (line.startsWith('```')) {
    const code = [];
    while (++i < lines.length && !lines[i].startsWith('```')) code.push(lines[i]);
    body.push(`<pre><code>${escape(code.join('\n'))}</code></pre>`);
  } else if (/^#{1,3} /.test(line)) {
    const [, hashes, title] = line.match(/^(#{1,3}) (.+)$/);
    const level = hashes.length;
    let id = '';
    if (level === 2) {
      id = `part-${sections.length + 1}`;
      sections.push({ id, title });
    }
    body.push(`<h${level}${id ? ` id="${id}"` : ''}>${inline(title)}</h${level}>`);
  } else if (line.startsWith('|')) {
    const rows = [];
    while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
    i--;
    const row = (text, tag) => `<tr>${text.split('|').slice(1, -1).map(cell => `<${tag}${tag === 'th' ? ' scope="col"' : ''}>${inline(cell.trim())}</${tag}>`).join('')}</tr>`;
    body.push(`<div class="table-wrap"><table><thead>${row(rows[0], 'th')}</thead><tbody>${rows.slice(2).map(text => row(text, 'td')).join('')}</tbody></table></div>`);
  } else if (/^[-*] |^\d+\. /.test(line)) {
    const ordered = /^\d+\. /.test(line);
    const pattern = ordered ? /^\d+\. / : /^[-*] /;
    const items = [];
    while (i < lines.length && pattern.test(lines[i])) items.push(`<li>${inline(lines[i++].replace(pattern, ''))}</li>`);
    i--;
    const tag = ordered ? 'ol' : 'ul';
    body.push(`<${tag}>${items.join('')}</${tag}>`);
  } else {
    const paragraph = [line];
    while (i + 1 < lines.length && lines[i + 1].trim() && !block(lines[i + 1])) paragraph.push(lines[++i]);
    body.push(`<p>${inline(paragraph.join(' '))}</p>`);
  }
}
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Finbharat — Hostinger implementation guide</title><style>
:root{--ink:#172b36;--teal:#114c5a;--muted:#4a636b;--line:#d7ddd8;--paper:#f7f5f0;--sage:#e6f0ee}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:24px}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.75 system-ui,-apple-system,"Segoe UI",sans-serif}.brand{max-width:1240px;margin:auto;padding:30px 28px;display:flex;justify-content:space-between;gap:20px;align-items:center;border-bottom:1px solid var(--line)}.brand img{width:225px;height:40px}.brand p{margin:0;text-align:right;font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}.layout{max-width:1240px;margin:auto;padding:48px 28px 90px;display:grid;grid-template-columns:255px minmax(0,1fr);gap:58px}nav{position:sticky;top:24px;align-self:start;font-size:12px;max-height:calc(100vh - 48px);overflow:auto}nav strong{display:block;margin-bottom:14px;text-transform:uppercase;letter-spacing:.1em}nav a{display:block;text-decoration:none;color:var(--muted);padding:6px 8px 6px 0;line-height:1.5}nav a:hover,nav a:focus-visible{color:var(--teal);text-decoration:underline}main{min-width:0}h1{font-size:44px;line-height:1.1;letter-spacing:-.045em;margin:0 0 24px;max-width:720px}h2{font-size:27px;line-height:1.25;letter-spacing:-.025em;border-top:1px solid var(--line);padding-top:30px;margin:52px 0 24px;break-after:avoid}p{margin:20px 0;overflow-wrap:anywhere}a{color:var(--teal);text-underline-offset:3px}li{padding-left:4px;margin:10px 0}ul,ol{padding-left:24px}strong{font-weight:650}code{font: .84em/1.5 ui-monospace,SFMono-Regular,monospace;background:var(--sage);padding:2px 5px;border-radius:4px;overflow-wrap:anywhere}pre{background:#102e38;color:#fffefa;padding:20px 22px;border-radius:12px;font-size:12px;line-height:1.65;white-space:pre-wrap;overflow-wrap:anywhere;break-inside:avoid}pre code{color:inherit;background:none;padding:0;font:inherit;white-space:pre-wrap}.table-wrap{overflow-x:auto;margin:24px 0}table{border-collapse:collapse;width:100%;font-size:13px;line-height:1.65}td,th{border-bottom:1px solid var(--line);padding:12px;text-align:left;vertical-align:top;overflow-wrap:anywhere}th{background:var(--sage);font-weight:650}td:first-child{width:29%;font-weight:550}tr{break-inside:avoid}footer{max-width:1240px;margin:auto;padding:24px 28px;border-top:1px solid var(--line);font-size:12px;color:var(--muted)}.note{background:var(--sage);border-left:3px solid var(--teal);padding:16px 20px;margin-bottom:32px;font-size:14px}.note p{margin:0}@media(max-width:850px){.layout{display:block;padding:30px 20px}nav{position:static;max-height:none;columns:2;margin-bottom:36px}nav strong{column-span:all}nav a{break-inside:avoid}.brand{padding:22px 20px}.brand img{width:185px;height:auto}.brand p{font-size:10px}h1{font-size:35px}h2{font-size:24px}}@media(max-width:480px){nav{columns:1}.brand{align-items:flex-start;flex-direction:column}.brand p{text-align:left}h1{font-size:31px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}@media print{@page{size:A4;margin:16mm}body{background:white;font-size:10pt;line-height:1.55}.brand{padding:0 0 14px}.brand img{width:180px;height:auto}nav{display:none}.layout{display:block;padding:24px 0}.note{font-size:9pt;margin-bottom:20px;padding:10px 14px}h1{font-size:27pt}h2{font-size:16pt;margin-top:28px;padding-top:18px}p{margin:12px 0}li{margin:6px 0}pre{background:#f0f3f2;color:#172b36;font-size:8pt;border:1px solid var(--line);padding:12px}table{font-size:8.5pt}td,th{padding:7px}.table-wrap{overflow:visible}footer{padding:12px 0}a{color:inherit;text-decoration:none}}
</style></head><body><header class="brand"><img src="data:image/svg+xml;base64,${logo}" alt="Finbharat"><p>Website + WordPress<br>Hostinger implementation · 17 October 2026</p></header><div class="layout"><nav aria-label="Guide contents"><strong>Implementation steps</strong>${sections.map(section => `<a href="#${section.id}">${escape(section.title)}</a>`).join('')}</nav><main><aside class="note"><p><strong>Start here:</strong> deploy the website, install WordPress on a second temporary domain, import content, then connect and verify publishing. Automatic WordPress-to-Hostinger deployment is a separate integration step.</p></aside>${body.join('\n')}</main></div><footer>Finbharat Technology Private Limited · Building wealth, Strengthening Bharat · Instructions and implementation status; not a confirmation of live hosting setup.</footer></body></html>`;
await writeFile('docs/hostinger-implementation.html', html);
await mkdir('output/hostinger', { recursive: true });
await writeFile('output/hostinger/Finbharat-Hostinger-Complete-Guide.html', html);
await writeFile('output/hostinger/Finbharat-Hostinger-Complete-Guide.md', source);
console.log(`Hostinger implementation guide generated: ${sections.length} sections, standalone HTML and Markdown.`);
