import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  console.log("Starting build from:", __dirname);
  const isWindows = process.platform === 'win32';
  if (isWindows) {
    execSync('pnpm run build', { cwd: __dirname, stdio: 'inherit' });
  } else {
    // When invoked in WSL / Linux, bridge to Windows cmd where pnpm / node is installed
    execSync('/mnt/c/Windows/System32/cmd.exe /c "cd /d D:\\VPS\\projects\\agent360\\frontend && pnpm run build"', {
      stdio: 'inherit'
    });
  }
  console.log("Build completed successfully!");
}

run().catch(err => {
  console.error("Build failed:", err);
  process.exit(1);
});
