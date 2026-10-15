const vite = require('vite');
const fs = require('fs');
const js = fs.readFileSync('dist/assets/index-lyZRu0Ay.js', 'utf8');

// Test the functions we touched:
// w1, b1, k1, j1, S1, N1, C1, P1, Gh
const targetNames = ['w1', 'b1', 'k1', 'j1', 'S1', 'N1', 'C1', 'P1', 'Gh'];
targetNames.forEach(name => {
  const idx = js.indexOf(`function ${name}(`);
  const asyncIdx = js.indexOf(`async function ${name}(`);
  const pos = idx !== -1 ? idx : asyncIdx;
  if (pos !== -1) {
    // find next function
    const nextFn = js.indexOf('function ', pos + 15);
    const chunk = js.slice(pos, nextFn !== -1 ? nextFn : pos + 3000);
    try {
      vite.parseAst(chunk);
      console.log(`Function ${name}: VALID AST`);
    } catch (e) {
      console.log(`Function ${name}: FAILED ->`, e.message);
    }
  } else {
    console.log(`Function ${name}: not found`);
  }
});
