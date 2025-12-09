#!/usr/bin/env node

/**
 * Analyze Lighthouse test results from CSV
 * Provides summary statistics and comparison across rendering strategies
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_FILE = path.join(__dirname, '..', 'lighthouse-results.csv');

function parseCSV(filepath) {
  if (!fs.existsSync(filepath)) {
    console.error('❌ No results file found. Run tests first: npm run test:all');
    process.exit(1);
  }

  const content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  const data = lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, i) => {
      obj[header] = values[i];
      return obj;
    }, {});
  });

  return data;
}

function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
}

function calculateStats(values) {
  const sorted = values.sort((a, b) => a - b);
  const len = sorted.length;
  const mean = values.reduce((a, b) => a + b, 0) / len;
  const median = len % 2 === 0 
    ? (sorted[len/2 - 1] + sorted[len/2]) / 2 
    : sorted[Math.floor(len/2)];
  const min = sorted[0];
  const max = sorted[len - 1];
  const std = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / len);
  
  return { mean, median, min, max, std };
}

function analyze(data) {
  console.log('\n📊 PERFORMANCE ANALYSIS REPORT');
  console.log('='.repeat(80));
  
  // Group by page and strategy
  const byPage = groupBy(data, 'page');
  
  for (const [page, pageData] of Object.entries(byPage)) {
    console.log(`\n📄 Page: ${page.toUpperCase()}`);
    console.log('-'.repeat(80));
    
    const byStrategy = groupBy(pageData, 'strategy');
    
    console.log('\n  Strategy  | Score | TTFB  | FCP   | LCP   | SI    | TBT   | CLS   | Samples');
    console.log('  ' + '-'.repeat(76));
    
    const results = {};
    
    for (const [strategy, records] of Object.entries(byStrategy)) {
      const metrics = {
        score: records.map(r => parseFloat(r.score)),
        TTFB: records.map(r => parseFloat(r.TTFB)),
        FCP: records.map(r => parseFloat(r.FCP)),
        LCP: records.map(r => parseFloat(r.LCP)),
        SI: records.map(r => parseFloat(r.SI)),
        TBT: records.map(r => parseFloat(r.TBT)),
        CLS: records.map(r => parseFloat(r.CLS))
      };
      
      results[strategy] = {
        score: calculateStats(metrics.score).mean,
        TTFB: calculateStats(metrics.TTFB).mean,
        FCP: calculateStats(metrics.FCP).mean,
        LCP: calculateStats(metrics.LCP).mean,
        SI: calculateStats(metrics.SI).mean,
        TBT: calculateStats(metrics.TBT).mean,
        CLS: calculateStats(metrics.CLS).mean,
        count: records.length
      };
      
      const r = results[strategy];
      console.log(`  ${strategy.toUpperCase().padEnd(10)}|  ${Math.round(r.score).toString().padStart(3)}  | ${Math.round(r.TTFB).toString().padStart(5)} | ${Math.round(r.FCP).toString().padStart(5)} | ${Math.round(r.LCP).toString().padStart(5)} | ${Math.round(r.SI).toString().padStart(5)} | ${Math.round(r.TBT).toString().padStart(5)} | ${r.CLS.toFixed(3)} | ${r.count.toString().padStart(7)}`);
    }
    
    // Find best strategy for each metric
    console.log('\n  🏆 Best performers:');
    const metrics = ['score', 'TTFB', 'FCP', 'LCP', 'SI', 'TBT', 'CLS'];
    for (const metric of metrics) {
      const strategies = Object.entries(results);
      const best = metric === 'score' 
        ? strategies.reduce((a, b) => a[1][metric] > b[1][metric] ? a : b)
        : strategies.reduce((a, b) => a[1][metric] < b[1][metric] ? a : b);
      
      const value = metric === 'CLS' 
        ? best[1][metric].toFixed(3)
        : Math.round(best[1][metric]);
      console.log(`     ${metric.padEnd(5)}: ${best[0].toUpperCase().padEnd(4)} (${value})`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('📈 Analysis complete!\n');
}

function main() {
  const data = parseCSV(CSV_FILE);
  
  if (data.length === 0) {
    console.error('❌ No data found in results file');
    process.exit(1);
  }
  
  console.log(`\n✅ Loaded ${data.length} test results from ${path.basename(CSV_FILE)}`);
  analyze(data);
}

main();
