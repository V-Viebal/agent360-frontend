import { build } from './node_modules/.pnpm/vite@6.4.4_@types+node@22.20.5_jiti@2.7.0_lightningcss@1.32.0/node_modules/vite/dist/node/index.js';

async function run() {
  console.log("Starting build...");
  await build({
    configFile: './vite.config.ts'
  });
  console.log("Build completed successfully!");
}

run().catch(err => {
  console.error("Build failed:", err);
  process.exit(1);
});
