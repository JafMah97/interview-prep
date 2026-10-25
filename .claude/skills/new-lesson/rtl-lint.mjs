// Flags RTL problems in Arabic markdown lessons:
//  L = prose line whose first strong character is Latin (renders LTR / jumbled)
//  D = inline token starting with a dot, like `.com` (dot jumps to the end)
//  C = Arabic text inside a code block (renders reversed)
//  R = digit range like 172.16-31
import { readFileSync } from 'node:fs';

for (const file of process.argv.slice(2)) {
  const lines = readFileSync(file, 'utf8').split('\n');
  let inCode = false;
  let inDetailsSummary = false;
  const out = [];
  lines.forEach((line, i) => {
    const n = i + 1;
    if (/^\s*```/.test(line)) { inCode = !inCode; return; }
    if (inCode) {
      if (/[؀-ۿ]/.test(line)) out.push(`${n} C: ${line.trim()}`);
      return;
    }
    if (/^\s*(<\/?(div|details|br|p)\b[^>]*>\s*)*$/.test(line) || line.trim() === '' || /^\s*\|?\s*-{3,}/.test(line) || /^---\s*$/.test(line)) return;
    // strip markdown prefixes and html tags
    let s = line.replace(/<[^>]+>/g, '').replace(/^\s*(>\s*)*/, '').replace(/^\s*(#+|[-*]|\d+\.)\s+/, '');
    s = s.replace(/^\|/, '');
    const first = s.match(/[A-Za-z؀-ۿ]/);
    if (first && /[A-Za-z]/.test(first[0])) out.push(`${n} L: ${line.trim().slice(0, 110)}`);
    if (/`\.[A-Za-z]/.test(line) || /(^|[\s(،])\.[a-z]{2,}\b/.test(line)) out.push(`${n} D: ${line.trim().slice(0, 110)}`);
    if (/\d+\.\d+-\d+/.test(line)) out.push(`${n} R: ${line.trim().slice(0, 110)}`);
  });
  console.log(`=== ${file} (${out.length})`);
  console.log(out.join('\n'));
}
