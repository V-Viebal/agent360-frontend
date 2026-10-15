const fs = require('fs');
const path = 'projects/agent360/frontend/dist/assets/index-DhmfErsu.js';
let code = fs.readFileSync(path, 'utf8');

// 1. In index-DhmfErsu.js, the left sidebar had:
// `fixed lg:static inset-y-0 left-0 z-40 w-[280px] h-full flex flex-col border-r border-[#1e1e24] bg-[#0f0f13] shrink-0 transition-transform duration-200 ease-in-out ...`
// When `!oe` (mobileSidebarOpen === false), on mobile (<1024px), it should be hidden with `hidden lg:flex`!
// If it is `flex` with `-translate-x-full`, in some viewports or without overflow clipping, children might render or bleed into the corner.
console.log('Patching left sidebar to use hidden lg:flex when !oe...');

code = code.replace(
  '${oe?"translate-x-0 shadow-2xl opacity-100 pointer-events-auto":"-translate-x-full opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto lg:translate-x-0"}',
  '${oe?"flex translate-x-0 shadow-2xl z-50":"hidden lg:flex lg:translate-x-0"}'
);

code = code.replace(
  '${fe?"translate-x-0 shadow-2xl opacity-100 pointer-events-auto":"translate-x-full opacity-0 pointer-events-none xl:opacity-100 xl:pointer-events-auto xl:translate-x-0"}',
  '${fe?"flex translate-x-0 shadow-2xl z-50":"hidden xl:flex xl:translate-x-0"}'
);

// 2. Remove window controls Minus and Square in the right panel header if still present
code = code.replace(
  'o.jsx("button",{className:"hover:text-white cursor-pointer hidden xl:inline-block",children:o.jsx(l1,{size:13})}),o.jsx("button",{className:"hover:text-white cursor-pointer hidden xl:inline-block",children:o.jsx(h1,{size:11})}),',
  ''
);

fs.writeFileSync(path, code, 'utf8');
console.log('Applied patch_layout successfully!');
