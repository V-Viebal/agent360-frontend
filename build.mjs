import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  console.log("Starting build from:", __dirname);
  const isWindows = process.platform === 'win32';
  if (isWindows) {
    execSync('node build.cjs', { cwd: __dirname, stdio: 'inherit' });
  } else {
    // When invoked in WSL / Linux, bridge to Windows Node.exe where the Windows native esbuild binary is installed
    try {
      execSync('/mnt/c/Windows/System32/cmd.exe /c "cd /d D:\\VPS\\projects\\agent360\\frontend && C:\\nvm4w\\nodejs\\node.exe build.cjs"', {
        stdio: 'inherit'
      });
    } catch (e) {
      // Fallback direct vite build
      const vite = await import('./node_modules/.pnpm/vite@6.4.4_@types+node@22.2_22c7c4b8b9a38796d0bba20886424bd3/node_modules/vite/dist/node/index.js');
      await vite.build({
        root: __dirname,
        configFile: path.resolve(__dirname, 'vite.config.ts')
      });
    }
  }
  console.log("Build completed successfully!");
}

run().catch(err => {
  console.error("Build failed:", err);
  process.exit(1);
});
