#!/usr/bin/env node
import { build } from 'esbuild';
import { readdirSync } from 'fs';

// Find all TypeScript files in src/
const srcFiles = readdirSync('src').filter(f => f.endsWith('.ts'));

console.log(`Building ${srcFiles.length} utilities...`);

for (const file of srcFiles) {
  const name = file.replace('.ts', '');

  // Convert kebab-case to PascalCase for global name
  // valid-jpn-phone-number → ValidJpnPhoneNumber
  const globalName = name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  await build({
    entryPoints: [`src/${file}`],
    bundle: true,
    format: 'iife',
    globalName,
    outfile: `${name}.js`,
    minify: true,
  });

  console.log(`✓ ${name}.js (global: ${globalName})`);
}

console.log('✓ All utilities built successfully');