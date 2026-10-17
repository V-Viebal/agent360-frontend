const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'dist', 'assets', 'index-mfberHas.css');
const jsPath = path.join(__dirname, 'dist', 'assets', 'index-lyZRu0Ay.js');
const htmlPath = path.join(__dirname, 'dist', 'index.html');

console.log('Reading JS, HTML and current CSS...');
const jsCode = fs.readFileSync(jsPath, 'utf8');
const htmlCode = fs.readFileSync(htmlPath, 'utf8');
const fullContent = jsCode + ' ' + htmlCode;
const cssCode = fs.readFileSync(cssPath, 'utf8');

console.log('Original CSS length:', (cssCode.length / 1024 / 1024).toFixed(2), 'MB');

// Split CSS into rules and keep only used selectors + keyframes + root + custom overrides
// A simple fast CSS purger:
// Split by closing brace '}'
const rules = cssCode.split('}');
const preserved = [];

// Match classes like .bg-white, .text-xs, etc.
for (let i = 0; i < rules.length; i++) {
  const rule = rules[i].trim();
  if (!rule) continue;

  // Keep @keyframes, @font-face, :root, body, html, scrollbars
  if (
    rule.includes('@keyframes') ||
    rule.includes('@font-face') ||
    rule.includes(':root') ||
    rule.startsWith('body') ||
    rule.startsWith('html') ||
    rule.includes('::-webkit-scrollbar') ||
    rule.includes('.no-scrollbar') ||
    rule.includes('@layer base') ||
    rule.includes('*')
  ) {
    preserved.push(rule + '}');
    continue;
  }

  // Check if any selector in this rule is mentioned in JS/HTML
  const selectorPart = rule.split('{')[0];
  if (!selectorPart) continue;

  // Find class names in selector
  const classMatches = selectorPart.match(/\.([a-zA-Z0-9_\-\[\]#\/%\\.:]+)/g);
  if (!classMatches) {
    // Media query or generic element selector
    if (selectorPart.includes('@media') || selectorPart.includes('@charset') || selectorPart.includes('@import')) {
      preserved.push(rule + '}');
    }
    continue;
  }

  let isUsed = false;
  for (const rawClass of classMatches) {
    const cleanClass = rawClass
      .replace(/^\./, '')
      .replace(/\\/g, '')
      .split(':')[0]; // remove hover, focus, etc.

    if (cleanClass.length > 1 && fullContent.includes(cleanClass)) {
      isUsed = true;
      break;
    }
  }

  if (isUsed) {
    preserved.push(rule + '}');
  }
}

const purgedCss = preserved.join('\n');
console.log('Purged CSS length:', (purgedCss.length / 1024).toFixed(1), 'KB (Lean & Scaled Down!)');

fs.writeFileSync(cssPath, purgedCss, 'utf8');
console.log('Successfully saved lean CSS!');
