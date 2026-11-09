#!/usr/bin/env node

/**
 * Unified Agent360 Local Fullstack Runner
 * 
 * Spins up:
 * 1. Agent360.API (.NET 10 Kestrel) on port 5290
 * 2. Agent360 Frontend (Vite Dev Server) on port 3000
 * With graceful shutdown, health check probe, and auto reverse-proxy linking.
 */

import { spawn } from 'child_process';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootFrontend = path.resolve(__dirname, '..');
const rootBackend = path.resolve(rootFrontend, '../backend/src/Agent360.API');

const isBackendOnly = process.argv.includes('--backend-only');

function checkHealth(url, timeoutMs = 1500) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: timeoutMs }, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForBackend(maxRetries = 25, delayMs = 600) {
  for (let i = 0; i < maxRetries; i++) {
    const ok = await checkHealth('http://127.0.0.1:5290/api/v1/voice/models');
    if (ok) return true;
    await new Promise((r) => setTimeout(r, delayMs));
  }
  return false;
}

console.log('====================================================');
console.log('   Agent360 Fullstack Local Orchestrator (1-Touch)  ');
console.log('====================================================');

// 1. Check if backend is already listening
const isAlreadyUp = await checkHealth('http://127.0.0.1:5290/api/v1/voice/models', 800);

let backendProcess = null;
if (isAlreadyUp) {
  console.log('✓ Agent360 Backend (.NET 10) is already running and healthy at http://127.0.0.1:5290');
} else {
  console.log('🚀 Starting Agent360 Backend API (.NET 10) on port 5290...');
  
  const isWsl = process.platform === 'linux' && fs.existsSync('/mnt/c/Windows');
  const dllArg = isWsl
    ? 'D:/vps/projects/agent360/backend/src/Agent360.API/bin/Debug/net10.0/Agent360.API.dll'
    : path.resolve(rootBackend, 'bin/Debug/net10.0/Agent360.API.dll');

  backendProcess = spawn('dotnet', [dllArg, '--urls', 'http://0.0.0.0:5290'], {
    cwd: rootBackend,
    stdio: isBackendOnly ? 'ignore' : 'inherit',
    detached: isBackendOnly,
    windowsHide: true,
  });
  if (isBackendOnly) {
    backendProcess.unref();
  }

  backendProcess.on('error', (err) => {
    console.error('Failed to spawn dotnet backend:', err.message);
  });

  const healthy = await waitForBackend();
  if (healthy) {
    console.log('✓ Agent360 Backend is UP and responding at http://127.0.0.1:5290');
  } else {
    console.warn('⚠️ Backend did not answer health probe within timeout, proceeding with startup...');
  }
}

if (isBackendOnly) {
  console.log('Backend-only mode selected. Exiting runner while backend persists.');
  process.exit(0);
}

// 2. Start Vite Frontend
console.log('⚡ Starting Agent360 Frontend (Vite) on port 3000...');
const viteBin = path.resolve(rootFrontend, 'node_modules/vite/bin/vite.js');

const frontendProcess = spawn(process.execPath, [viteBin, '--port', '3000', '--host', '0.0.0.0'], {
  cwd: rootFrontend,
  stdio: 'inherit',
});

function cleanup() {
  console.log('\nShutting down Agent360 Fullstack services...');
  if (frontendProcess && !frontendProcess.killed) {
    frontendProcess.kill();
  }
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill();
  }
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

frontendProcess.on('exit', (code) => {
  cleanup();
});
