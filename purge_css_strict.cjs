const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'dist', 'assets', 'index-mfberHas.css');
const jsPath = path.join(__dirname, 'dist', 'assets', 'index-lyZRu0Ay.js');
const htmlPath = path.join(__dirname, 'dist', 'index.html');

const jsCode = fs.readFileSync(jsPath, 'utf8');
const htmlCode = fs.readFileSync(htmlPath, 'utf8');
const fullContent = jsCode + ' ' + htmlCode;

// Extract all class-like strings from JS & HTML
const classRegex = /className:\s*(?:"([^"]+)"|`([^`]+)`)/g;
const stringTokens = new Set();

let m;
while ((m = classRegex.exec(jsCode)) !== null) {
  const str = m[1] || m[2] || '';
  // Split by whitespace
  str.split(/\s+/).forEach(t => {
    // If it contains template interpolations ${...}, extract the literal parts
    t.replace(/\$\{[^}]+\}/g, ' ').split(/\s+/).forEach(token => {
      const clean = token.trim();
      if (clean && !clean.includes('$') && !clean.includes('{') && !clean.includes('}')) {
        stringTokens.add(clean);
      }
    });
  });
}

// Add known classes used in components
['flex', 'hidden', 'block', 'relative', 'absolute', 'fixed', 'inset-0', 'h-screen', 'w-screen', 'overflow-hidden',
 'bg-[#0c0c0e]', 'bg-[#0f0f13]', 'bg-[#14141a]', 'bg-[#181820]', 'bg-[#1c1c24]', 'bg-[#22222c]', 'bg-[#252530]',
 'text-[#ff7a00]', 'text-white', 'text-neutral-200', 'text-neutral-300', 'text-neutral-400', 'text-neutral-500', 'text-emerald-400',
 'border', 'border-[#1c1c22]', 'border-[#1e1e24]', 'border-[#22222c]', 'border-[#242430]', 'border-[#262632]', 'border-[#2a2a34]', 'border-[#2a2a36]',
 'rounded-full', 'rounded-xl', 'rounded-2xl', 'rounded-lg', 'font-sans', 'font-mono', 'text-xs', 'text-sm', 'text-[10px]', 'text-[11px]',
 'p-1', 'p-2', 'p-2.5', 'p-3', 'p-4', 'p-5', 'px-3', 'px-4', 'py-1', 'py-2', 'py-2.5', 'py-3',
 'gap-1', 'gap-1.5', 'gap-2', 'gap-3', 'space-y-1', 'space-y-1.5', 'space-y-2', 'space-y-3', 'space-y-4',
 'max-w-3xl', 'max-w-xl', 'w-full', 'h-full', 'truncate', 'shrink-0', 'cursor-pointer', 'shadow-sm', 'shadow-xl'
].forEach(c => stringTokens.add(c));

console.log('Total unique class tokens extracted:', stringTokens.size);

// Read current CSS
const cssCode = fs.readFileSync(cssPath, 'utf8');
const rules = cssCode.split('}');
const kept = [];

for (const rule of rules) {
  const trimmed = rule.trim();
  if (!trimmed) continue;

  if (
    trimmed.includes('@keyframes') ||
    trimmed.includes('@font-face') ||
    trimmed.includes(':root') ||
    trimmed.startsWith('body') ||
    trimmed.startsWith('html') ||
    trimmed.includes('scrollbar') ||
    trimmed.includes('.no-scrollbar') ||
    trimmed.startsWith('*')
  ) {
    kept.push(trimmed + '}');
    continue;
  }

  const parts = trimmed.split('{');
  if (parts.length < 2) continue;
  const selector = parts[0].trim();

  // Match class
  const classInSelector = selector.match(/\.([a-zA-Z0-9_\-\[\]#\/%]+)/);
  if (classInSelector) {
    const raw = classInSelector[1];
    // Check if directly in stringTokens
    if (stringTokens.has(raw) || stringTokens.has(raw.replace(/\\/g, ''))) {
      kept.push(trimmed + '}');
      continue;
    }
  }
}

const finalCss = kept.join('\n');
console.log('Strict Lean Purged CSS length:', (finalCss.length / 1024).toFixed(1), 'KB (Ultra Lean!)');

fs.writeFileSync(cssPath, finalCss, 'utf8');
console.log('Done!');
