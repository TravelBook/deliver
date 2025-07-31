#!/usr/bin/env node
import { execSync } from 'child_process';
import { readdirSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

// Create a temporary directory for compilation
const tempDir = mkdtempSync(join(tmpdir(), 'deliver-build-'));

try {
  // Compile TypeScript files to temporary directory
  console.log('Compiling TypeScript files...');
  execSync(`npx tsc --outDir "${tempDir}"`, { stdio: 'inherit' });

  // Find all compiled JavaScript files in temp directory
  const distFiles = readdirSync(tempDir).filter(f => f.endsWith('.js'));

  console.log(`Post-processing ${distFiles.length} utilities...`);

  for (const file of distFiles) {
    const name = file.replace('.js', '');

    // Read the compiled JS file
    let content = readFileSync(join(tempDir, file), 'utf8');

    // Remove import/export statements and ES module markers
    content = content
      .replace(/^import .+;$/gm, '')              // Remove import statements
      .replace(/^export \{[^}]+\};?$/gm, '')      // Remove export statements
      .replace(/^export /gm, '')                  // Remove export keyword
      .replace(/Object\.defineProperty\(exports, "__esModule"[^;]+;/g, '') // Remove ES module marker
      .trim();

    // Write the processed file to root
    writeFileSync(`${name}.js`, content);

    console.log(`✓ ${name}.js (processed from TypeScript)`);
  }

  console.log('✓ All utilities built successfully');
} finally {
  // Clean up temporary directory
  rmSync(tempDir, { recursive: true, force: true });
}