const path = require('path');
const vite = require('./node_modules/.pnpm/vite@6.4.4_@types+node@22.2_22c7c4b8b9a38796d0bba20886424bd3/node_modules/vite');

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
