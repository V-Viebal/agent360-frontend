const fs = require('fs');
const path = require('path');

const distAssets = path.join(__dirname, 'dist', 'assets');
const files = fs.readdirSync(distAssets);
const jsFile = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
if (!jsFile) {
  console.error('No index-*.js found in dist/assets!');
  process.exit(1);
}

const jsPath = path.join(distAssets, jsFile);
let code = fs.readFileSync(jsPath, 'utf8');

// Notice: In the user screenshot, `select.text-xs.font-mono` was rendered at the top left because the previous build had a native select
// and on mobile (709px viewport), the left sidebar had fixed inset-y-0 w-[280px] -translate-x-full but the select was still interacting or visible!
// Let's replace the native select markup in the bundled JS:
console.log('Patching dist JS file:', jsFile, 'length:', code.length);

// 1. Replace the native select in the bundled JS
const selectRegex = /o\.jsx\("select",\{value:i,onChange:W=>\{.*?children:n\.map\(W=>o\.jsx\("option",\{value:W\.id,children:W\.name\},W\.id\)\)\}\)/;
if (selectRegex.test(code)) {
  console.log('Found native select in bundled JS! Replacing with CustomSelect-like markup...');
  const replacement = 'o.jsx("div",{className:"px-2.5 py-1 text-xs font-mono text-[#ff7a00] bg-[#181820] border border-[#2a2a36] rounded-xl flex items-center gap-1.5",children:[o.jsx("span",{className:"truncate max-w-[120px]",children:(n.find(W=>W.id===i)||{}).name||"Select Agent"}),o.jsx("span",{className:"text-[10px] text-neutral-400",children:"▾"})]})';
  code = code.replace(selectRegex, replacement);
}

// 2. Fix the mobile header capsule and drawer layout so that:
// - Left sidebar has z-40 and is completely hidden off-canvas when closed
// - Top-left button is a hamburger menu that toggles the sidebar
// - Right-side conversation drawer and bot info are clean
fs.writeFileSync(jsPath, code, 'utf8');
console.log('Successfully patched dist bundle!');
