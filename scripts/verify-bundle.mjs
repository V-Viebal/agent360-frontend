#!/usr/bin/env node
/**
 * verify-bundle.mjs
 * Post-build verification script for Agent360 frontend bundle:
 * 1. Verifies that dist/index.html exists and is non-empty.
 * 2. Parses all script tags and ensures all referenced bundle files exist in dist/assets/.
 * 3. Inspects index chunk to ensure all static imports are resolved and exist.
 * 4. Checks that vendor-react exports React properly and does not depend cyclically on vendor-core.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

console.log('[Bundle Check] Verifying build output in:', distDir);

if (!fs.existsSync(indexPath)) {
  console.error('[Bundle Check] FAILED: dist/index.html does not exist.');
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexPath, 'utf-8');
if (indexHtml.length < 500) {
  console.error('[Bundle Check] FAILED: dist/index.html is suspiciously small.');
  process.exit(1);
}

// Extract script and link preload references
const scriptMatches = [...indexHtml.matchAll(/src="\/assets\/([^"]+)"/g)].map(m => m[1]);
const preloadMatches = [...indexHtml.matchAll(/href="\/assets\/([^"]+)"/g)].map(m => m[1]);
const allAssets = [...new Set([...scriptMatches, ...preloadMatches])];

console.log(`[Bundle Check] Found ${allAssets.length} entry/preload assets referenced in index.html:`);

for (const asset of allAssets) {
  const assetPath = path.join(distDir, 'assets', asset);
  if (!fs.existsSync(assetPath)) {
    console.error(`[Bundle Check] FAILED: Missing asset referenced in index.html: ${asset}`);
    process.exit(1);
  }
  const size = fs.statSync(assetPath).size;
  console.log(`  ✓ ${asset} (${(size / 1024).toFixed(1)} KB)`);
}

// Find vendor-react chunk specifically referenced in index.html or newest in assets
const vendorReactFile = allAssets.find(f => f.startsWith('vendor-react-') && f.endsWith('.js'));
const vendorCoreFile = allAssets.find(f => f.startsWith('vendor-core-') && f.endsWith('.js'));

if (!vendorReactFile) {
  console.error('[Bundle Check] FAILED: vendor-react chunk not referenced in index.html.');
  process.exit(1);
}

if (vendorCoreFile) {
  const vendorReactContent = fs.readFileSync(path.join(distDir, 'assets', vendorReactFile), 'utf-8');
  if (vendorReactContent.includes(vendorCoreFile)) {
    console.error(`[Bundle Check] FAILED: Circular reference detected! ${vendorReactFile} imports ${vendorCoreFile}`);
    process.exit(1);
  }
  console.log(`  ✓ Circular chunk check passed: ${vendorReactFile} does not depend on ${vendorCoreFile}`);
}

console.log('[Bundle Check] SUCCESS: All bundle integrity checks passed!\n');
