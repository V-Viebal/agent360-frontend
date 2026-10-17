const vite = require('vite');
const fs = require('fs');
const js = fs.readFileSync('dist/assets/index-lyZRu0Ay.js', 'utf8');

// Find top level functions and test each one
const fnRegex = /\bfunction\s+([a-zA-Z0-9_$]+)\s*\(/g;
let m;
const fns = [];
while ((m = fnRegex.exec(js)) !== null) {
  fns.push({ name: m[1], pos: m.index });
}

console.log('Total functions:', fns.length);
for (let i = 0; i < fns.length; i++) {
  const start = fns[i].pos;
  const end = i < fns.length - 1 ? fns[i + 1].pos : js.length;
  const chunk = js.slice(start, end).replace(/^[;}]+/, '').replace(/[;}]+$/, '');
  try {
    vite.parseAst(chunk);
  } catch (e) {
    if (e.message.includes("Expected '}'")) {
      console.log(`Function ${fns[i].name} at pos ${start} has unclosed brace! Error:`, e.message);
      console.log('Head:', chunk.slice(0, 100));
      console.log('Tail:', chunk.slice(-100));
    }
  }
}
