const path = require('path');
const fs = require('fs');

// Dynamically locate installed vite package inside .pnpm to be resilient to pnpm hashes
const pnpmDir = path.resolve(__dirname, 'node_modules/.pnpm');
const viteEntry = fs.readdirSync(pnpmDir).find(f => f.startsWith('vite@'));
if (!viteEntry) {
  throw new Error('Vite package folder not found in node_modules/.pnpm');
}

const vitePath = path.resolve(pnpmDir, viteEntry, 'node_modules/vite');
const vite = require(vitePath);

async function main() {
  console.log("Starting Windows build from:", __dirname);
  await vite.build({
    root: __dirname,
    configFile: path.resolve(__dirname, 'vite.config.ts')
  });
  console.log("Build completed successfully!");
}

main().catch(err => {
  console.error("Build failed:", err);
  process.exit(1);
});
