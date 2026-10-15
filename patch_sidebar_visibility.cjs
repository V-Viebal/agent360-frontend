const fs = require('fs');
const jsPath = 'projects/agent360/frontend/dist/assets/index-DhmfErsu.js';
let code = fs.readFileSync(jsPath, 'utf8');

// The issue in the screenshot:
// The aside had `fixed lg:static inset-y-0 left-0 z-40 ... ${oe ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}`
// But because CSS overflow or lack of `hidden lg:flex` when `!oe`, the inner select box leaked into the viewport or was visible!
// If we change it to:
// `${oe ? "translate-x-0 shadow-2xl pointer-events-auto" : "-translate-x-full pointer-events-none lg:pointer-events-auto lg:translate-x-0"}`
// AND add `max-w-[85vw]` on mobile so it doesn't take the full screen!
console.log('Patching aside visibility and pointer-events in bundle...');

code = code.replace(
  '${oe?"translate-x-0 shadow-2xl":"-translate-x-full lg:translate-x-0"}',
  '${oe?"translate-x-0 shadow-2xl opacity-100 pointer-events-auto":"-translate-x-full opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto lg:translate-x-0"}'
);

code = code.replace(
  '${fe?"translate-x-0 shadow-2xl":"translate-x-full xl:translate-x-0"}',
  '${fe?"translate-x-0 shadow-2xl opacity-100 pointer-events-auto":"translate-x-full opacity-0 pointer-events-none xl:opacity-100 xl:pointer-events-auto xl:translate-x-0"}'
);

fs.writeFileSync(jsPath, code, 'utf8');
console.log('Successfully applied pointer-events and opacity fencing to mobile drawers!');
