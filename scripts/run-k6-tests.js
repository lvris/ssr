#!/usr/bin/env node

/**
 * Run K6 load tests for SSR vs ISR comparison
 * Measures server scalability and resource consumption
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_FILE = path.join(__dirname, '..', 'k6-results.csv');
const STRATEGIES = ['ssr', 'isr']; // Focus on SSR vs ISR for scalability comparison
const PAGE = 'list'; // Use simpler page for clearer results

function appendCSV(strategy, metrics) {
  const header = "timestamp,page,strategy,total_requests,failed_rate,avg_duration,p50_duration,p95_duration,p99_duration,max_duration,avg_ttfb,p95_ttfb,rps,max_vus\n";
  
  const row = `${new Date().toISOString()},${PAGE},${strategy},${metrics.total_requests},${metrics.failed_rate},${metrics.avg_duration},${metrics.p50_duration},${metrics.p95_duration},${metrics.p99_duration},${metrics.max_duration},${metrics.avg_ttfb},${metrics.p95_ttfb},${metrics.rps},${metrics.max_vus}\n`;

  if (!fs.existsSync(CSV_FILE)) fs.writeFileSync(CSV_FILE, header);
  fs.appendFileSync(CSV_FILE, row);
}

async function runK6(strategy) {
  return new Promise((resolve, reject) => {
    console.log(`\nRunning K6 load test for ${strategy.toUpperCase()}...`);
    console.log('   Simulating: 10 -> 50 -> 100 -> 200 concurrent users\n');

    const k6Process = spawn('k6', [
      'run',
      '--env', `STRATEGY=${strategy}`,
      '--env', `PAGE=${PAGE}`,
      '--env', 'BASE_URL=http://localhost:3333',
      path.join(__dirname, 'k6-load-test.js')
    ], {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true
    });

    let output = '';
    
    k6Process.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stdout.write(text);
    });

    k6Process.stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });

    k6Process.on('close', (code) => {
      if (code === 0) {
        // Parse k6 output to extract metrics
        const metrics = parseK6Output(output);
        if (metrics) {
          appendCSV(strategy, metrics);
        }
        resolve();
      } else {
        reject(new Error(`K6 test failed for ${strategy} with code ${code}`));
      }
    });
  });
}

function parseK6Output(output) {
  try {
    // Extract metrics from k6 output using regex
    const totalRequests = output.match(/http_reqs[.\s]+(\d+)/)?.[1];
    const failedRate = output.match(/http_req_failed[.\s]+([\d.]+)%/)?.[1] || '0';
    const avgDuration = output.match(/http_req_duration[.\s]+avg=([\d.]+)ms/)?.[1];
    const p50Duration = output.match(/http_req_duration[.\s]+.*med=([\d.]+)ms/)?.[1];
    const p95Duration = output.match(/http_req_duration[.\s]+.*p\(95\)=([\d.]+)ms/)?.[1];
    const p99Duration = output.match(/http_req_duration[.\s]+.*p\(99\)=([\d.]+)ms/)?.[1];
    const maxDuration = output.match(/http_req_duration[.\s]+.*max=([\d.]+)ms/)?.[1];
    const avgTTFB = output.match(/http_req_waiting[.\s]+avg=([\d.]+)ms/)?.[1];
    const p95TTFB = output.match(/http_req_waiting[.\s]+.*p\(95\)=([\d.]+)ms/)?.[1];
    const rps = output.match(/http_reqs[.\s]+[\d.]+\s+([\d.]+)\/s/)?.[1];
    const maxVUs = output.match(/vus_max[.\s]+.*max=(\d+)/)?.[1];

    if (!totalRequests || !avgDuration) {
      console.warn('WARNING: Could not parse all metrics from k6 output');
      return null;
    }

    return {
      total_requests: parseInt(totalRequests),
      failed_rate: parseFloat(failedRate),
      avg_duration: parseFloat(avgDuration),
      p50_duration: parseFloat(p50Duration || avgDuration),
      p95_duration: parseFloat(p95Duration || avgDuration),
      p99_duration: parseFloat(p99Duration || avgDuration),
      max_duration: parseFloat(maxDuration || avgDuration),
      avg_ttfb: parseFloat(avgTTFB || avgDuration),
      p95_ttfb: parseFloat(p95TTFB || avgTTFB || avgDuration),
      rps: parseFloat(rps || 0),
      max_vus: parseInt(maxVUs || 200)
    };
  } catch (err) {
    console.error('Error parsing k6 output:', err);
    return null;
  }
}

async function main() {
  console.log('\nStarting K6 Load Testing Suite\n');
  console.log('='.repeat(60));
  console.log(`Testing: ${STRATEGIES.join(' vs ').toUpperCase()}`);
  console.log(`Page: ${PAGE}`);
  console.log(`Duration: ~4 minutes per strategy (~8 min total)`);
  console.log('='.repeat(60));

  // Check if k6 is installed
  try {
    await new Promise((resolve, reject) => {
      const check = spawn('k6', ['version'], { shell: true });
      check.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error('k6 not found'));
      });
    });
  } catch (err) {
    console.error('\nERROR: k6 is not installed!');
    console.error('\nInstall k6:');
    console.error('  Windows: choco install k6 or winget install k6.k6');
    console.error('  Or download from: https://k6.io/docs/get-started/installation/\n');
    process.exit(1);
  }

  for (const strategy of STRATEGIES) {
    try {
      await runK6(strategy);
      console.log(`\n${strategy.toUpperCase()} test complete\n`);
    } catch (err) {
      console.error(`\nERROR testing ${strategy}:`, err.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`All K6 tests completed!`);
  console.log(`Results saved to: ${path.basename(CSV_FILE)}\n`);
}

main().catch(console.error);
