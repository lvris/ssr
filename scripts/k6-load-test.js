import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up to 10 users
    { duration: '1m', target: 50 },    // Ramp up to 50 users
    { duration: '1m', target: 100 },   // Ramp up to 100 users
    { duration: '1m', target: 200 },   // Ramp up to 200 users
    { duration: '30s', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s
    errors: ['rate<0.1'],              // Error rate should be below 10%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3333';
const PAGE = __ENV.PAGE || 'list';
const STRATEGY = __ENV.STRATEGY || 'ssr';

export default function () {
  const url = `${BASE_URL}/bench/${PAGE}/${STRATEGY}`;
  
  const res = http.get(url);
  
  const checkRes = check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 3000ms': (r) => r.timings.duration < 3000,
  });
  
  errorRate.add(!checkRes);
  
  sleep(1); // Think time between requests
}

export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data) {
  const { metrics } = data;
  
  return `
  ========================================
  K6 Load Test Results - ${STRATEGY.toUpperCase()}
  ========================================
  
  Page: ${PAGE}
  Strategy: ${STRATEGY}
  
  Metrics:
  --------
  Total Requests:        ${metrics.http_reqs.values.count}
  Failed Requests:       ${metrics.http_req_failed.values.rate * 100}%
  
  Request Duration:
    Average:             ${metrics.http_req_duration.values.avg.toFixed(2)} ms
    Median (p50):        ${metrics.http_req_duration.values.med.toFixed(2)} ms
    p95:                 ${metrics.http_req_duration.values['p(95)'].toFixed(2)} ms
    p99:                 ${metrics.http_req_duration.values['p(99)'].toFixed(2)} ms
    Max:                 ${metrics.http_req_duration.values.max.toFixed(2)} ms
  
  TTFB (Waiting):
    Average:             ${metrics.http_req_waiting.values.avg.toFixed(2)} ms
    Median:              ${metrics.http_req_waiting.values.med.toFixed(2)} ms
    p95:                 ${metrics.http_req_waiting.values['p(95)'].toFixed(2)} ms
  
  Throughput:
    Requests/sec:        ${metrics.http_reqs.values.rate.toFixed(2)}
    Data Received:       ${(metrics.data_received.values.count / 1024 / 1024).toFixed(2)} MB
  
  Virtual Users:
    Max VUs:             ${metrics.vus_max.values.max}
  
  ========================================
  `;
}
