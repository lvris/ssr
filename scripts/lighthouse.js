
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import desktopConfig from "lighthouse/core/config/desktop-config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STRATEGIES = ["ssr", "csr", "ssg", "isr"];
const CSV_FILE = path.join(__dirname, "..", "lighthouse-results.csv");
const RUNS = 5;

const SLOW_4G_THROTTLING = {
  rttMs: 150,
  throughputKbps: 1638.4,
  cpuSlowdownMultiplier: 4,
  requestLatencyMs: 0,
  downloadThroughputKbps: 1638.4,
  uploadThroughputKbps: 675,
};

const CONFIG = {
  extends: "lighthouse:default",
  settings: {
    onlyCategories: ["performance"],
    formFactor: "mobile",
    screenEmulation: { mobile: true, width: 430, height: 932, deviceScaleFactor: 2, disabled: false },
    throttlingMethod: "devtools",
    throttling: SLOW_4G_THROTTLING,
  },
};

async function run(url, chrome) {
  const { lhr } = await lighthouse(url, { logLevel: "error", output: "json", port: chrome.port }, CONFIG);
  const m = lhr.audits;
  return {
    score: lhr.categories.performance.score * 100,
    TTFB: m["server-response-time"]?.numericValue || 0,
    FCP: m["first-contentful-paint"]?.numericValue || 0,
    LCP: m["largest-contentful-paint"]?.numericValue || 0,
    SI: m["speed-index"]?.numericValue || 0,
    TBT: m["total-blocking-time"]?.numericValue || 0,
    CLS: m["cumulative-layout-shift"]?.numericValue || 0,
  };
}

function average(results) {
  const keys = Object.keys(results[0]);
  const avg = {};
  for (const key of keys) {
    const values = results.map((r) => r[key]);
    avg[key] = values.reduce((a, b) => a + b, 0) / values.length;
  }
  return avg;
}

function appendCSV(page, strategy, metrics) {
  const header = "timestamp,page,strategy,score,TTFB,FCP,LCP,SI,TBT,CLS\n";
  const row = `${new Date().toISOString()},${page},${strategy},${Math.round(metrics.score)},${Math.round(metrics.TTFB)},${Math.round(metrics.FCP)},${Math.round(metrics.LCP)},${Math.round(metrics.SI)},${Math.round(metrics.TBT)},${metrics.CLS.toFixed(3)}\n`;

  if (!fs.existsSync(CSV_FILE)) fs.writeFileSync(CSV_FILE, header);
  fs.appendFileSync(CSV_FILE, row);
}

async function main() {
  const [page, baseUrl = "http://localhost:3333"] = process.argv.slice(2);

  if (!page) {
    console.log("Usage: pnpm lighthouse <page> [baseUrl]\nExample: pnpm lighthouse home");
    process.exit(0);
  }

  console.log(`\n📱 Testing ${page} (Mobile + Slow 4G) - ${RUNS} runs per strategy\n`);

  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless", "--disable-gpu", "--no-sandbox"] });

  try {
    console.log("Strategy  Score  TTFB    FCP     LCP     SI      TBT     CLS");
    console.log("-".repeat(65));

    for (const s of STRATEGIES) {
      const url = `${baseUrl}/bench/${page}/${s}`;
      const results = [];

      for (let i = 0; i < RUNS; i++) {
        process.stdout.write(`\r${s.toUpperCase().padEnd(10)}Running ${i + 1}/${RUNS}...`);
        try {
          results.push(await run(url, chrome));
        } catch (e) {
          console.log(`\r${s.toUpperCase().padEnd(10)}Run ${i + 1} error: ${e.message}`);
        }
      }

      if (results.length > 0) {
        const m = average(results);
        appendCSV(page, s, m);
        console.log(`\r${s.toUpperCase().padEnd(10)}${String(Math.round(m.score)).padEnd(7)}${String(Math.round(m.TTFB)).padEnd(8)}${String(Math.round(m.FCP)).padEnd(8)}${String(Math.round(m.LCP)).padEnd(8)}${String(Math.round(m.SI)).padEnd(8)}${String(Math.round(m.TBT)).padEnd(8)}${m.CLS.toFixed(3)}`);
      }
    }
  } finally {
    await chrome.kill();
  }

  console.log(`\nAverage results (${RUNS} runs) appended to ${CSV_FILE}\n`);
}

main().catch(console.error);
