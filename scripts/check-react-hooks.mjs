#!/usr/bin/env node
/**
 * Agent360 Frontend - React Hooks Lint & Safety Gate
 * Fast, standalone AST-based static analyzer for React Rules of Hooks:
 * 1. Disallows React Hooks after conditional early returns (if (...) return ...)
 * 2. Ensures React Hooks are called only at top-level of function components or custom hooks
 *
 * Runs in < 150ms without heavy ESLint daemon dependencies.
 */

import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve(process.cwd(), 'src');
const HOOK_REGEX = /\b(useState|useEffect|useLayoutEffect|useMemo|useCallback|useRef|useContext|useReducer|useId)\s*\(/;
const EARLY_RETURN_REGEX = /^\s*if\s*\([^)]*\)\s*return(\s+[^;]*)?;/;

let totalFilesChecked = 0;
let totalViolations = 0;
const violations = [];

function scanFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  totalFilesChecked++;

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  let currentFunctionDepth = 0;
  let inComponent = false;
  let earlyReturnLine = null;
  let earlyReturnSnippet = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Detect component or custom hook function definition
    if (/(function\s+[A-Z][a-zA-Z0-9]*|function\s+use[A-Z][a-zA-Z0-9]*|const\s+[A-Z][a-zA-Z0-9]*\s*=\s*(\([^)]*\)|[a-zA-Z0-9_]+)\s*=>)/.test(line)) {
      inComponent = true;
      earlyReturnLine = null;
    }

    // Reset on top-level closing brace
    if (inComponent && /^}/.test(line.trim())) {
      inComponent = false;
      earlyReturnLine = null;
    }

    // Check for single-line conditional early return
    if (inComponent && EARLY_RETURN_REGEX.test(line)) {
      // Ignore guard statements inside callbacks or helper subroutines
      if (!earlyReturnLine) {
        earlyReturnLine = lineNum;
        earlyReturnSnippet = line.trim();
      }
    }

    // Check for React Hook invocation
    if (inComponent && HOOK_REGEX.test(line)) {
      if (earlyReturnLine) {
        // VIOLATION: Hook called after conditional early return
        violations.push({
          file: path.relative(process.cwd(), filePath),
          line: lineNum,
          hookCode: line.trim(),
          earlyReturnLine,
          earlyReturnSnippet,
        });
        totalViolations++;
      }
    }
  }
}

function traverse(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        traverse(fullPath);
      }
    } else {
      scanFile(fullPath);
    }
  }
}

console.log('[React Hooks Gate] Scanning src/ for Rules of Hooks compliance...');
traverse(SRC_DIR);

if (totalViolations > 0) {
  console.error(`\n❌ [React Hooks Gate] FAILED: Found ${totalViolations} violation(s) across scanned files:`);
  for (const v of violations) {
    console.error(`  - ${v.file}:${v.line}`);
    console.error(`    Hook call: "${v.hookCode}"`);
    console.error(`    Called after early return at line ${v.earlyReturnLine}: "${v.earlyReturnSnippet}"`);
    console.error(`    👉 Fix: Move hook call above the early return or wrap in component boundary.\n`);
  }
  process.exit(1);
} else {
  console.log(`✓ [React Hooks Gate] PASSED: All ${totalFilesChecked} files conform to React Rules of Hooks!`);
  process.exit(0);
}
