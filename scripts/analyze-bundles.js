#!/usr/bin/env node

/**
 * Analyze JavaScript bundle sizes for different rendering strategies
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUILD_DIR = path.join(__dirname, '..', '.next');

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBuildManifest() {
  const manifestPath = path.join(BUILD_DIR, 'build-manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.error('Build manifest not found. Run `npm run build` first.');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  
  console.log('\nBUNDLE SIZE ANALYSIS\n');
  console.log('='.repeat(80));
  
  // Analyze common chunks (shared by all pages)
  const sharedChunks = manifest.pages['/_app'] || [];
  let sharedSize = 0;
  
  console.log('\n🔧 Shared JavaScript (Common to all pages):');
  console.log('-'.repeat(80));
  
  for (const chunk of sharedChunks) {
    const chunkPath = path.join(BUILD_DIR, chunk);
    if (fs.existsSync(chunkPath)) {
      const size = fs.statSync(chunkPath).size;
      sharedSize += size;
      console.log(`  ${path.basename(chunk).padEnd(50)} ${formatBytes(size).padStart(10)}`);
    }
  }
  
  console.log('-'.repeat(80));
  console.log(`  Total Shared JS:${' '.repeat(38)}${formatBytes(sharedSize).padStart(10)}`);
  
  // Analyze page-specific bundles
  console.log('\nPage-Specific Bundles:\n');
  console.log('='.repeat(80));
  
  const strategies = ['csr', 'ssr', 'ssg', 'isr'];
  const pages = ['home', 'list'];
  
  const results = {};
  
  for (const page of pages) {
    console.log(`\n${page.toUpperCase()} Page:`);
    console.log('-'.repeat(80));
    
    results[page] = {};
    
    for (const strategy of strategies) {
      const pageKey = `/bench/${page}/${strategy}`;
      const chunks = manifest.pages[pageKey] || [];
      
      let pageSize = 0;
      for (const chunk of chunks) {
        const chunkPath = path.join(BUILD_DIR, chunk);
        if (fs.existsSync(chunkPath)) {
          pageSize += fs.statSync(chunkPath).size;
        }
      }
      
      const totalSize = sharedSize + pageSize;
      results[page][strategy] = {
        pageOnly: pageSize,
        total: totalSize,
        chunkCount: chunks.length
      };
      
      console.log(
        `  ${strategy.toUpperCase().padEnd(6)}` +
        `Page: ${formatBytes(pageSize).padStart(10)}  ` +
        `Total: ${formatBytes(totalSize).padStart(10)}  ` +
        `(${chunks.length} chunks)`
      );
    }
  }
  
  // Summary comparison
  console.log('\n\nSUMMARY COMPARISON\n');
  console.log('='.repeat(80));
  
  for (const page of pages) {
    console.log(`\n${page.toUpperCase()} Page - Total Bundle Size (including shared):`);
    const sorted = Object.entries(results[page])
      .sort((a, b) => a[1].total - b[1].total);
    
    for (const [strategy, data] of sorted) {
      const bar = '█'.repeat(Math.floor(data.total / 10000));
      console.log(`  ${strategy.toUpperCase().padEnd(6)} ${formatBytes(data.total).padStart(10)} ${bar}`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\nKey Insights:');
  console.log('  • All strategies share the same base React/Next.js framework (~' + formatBytes(sharedSize) + ')');
  console.log('  • CSR may have additional client-side fetching code');
  console.log('  • Bundle size affects Time to Interactive (TTI) and Total Blocking Time (TBT)');
  console.log('  • Smaller bundles = faster hydration = lower TBT\n');
  
  return results;
}

function main() {
  try {
    analyzeBuildManifest();
  } catch (err) {
    console.error('Error analyzing bundles:', err.message);
    process.exit(1);
  }
}

main();
