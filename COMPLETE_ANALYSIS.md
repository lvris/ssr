# Performance Analysis: Server-Side Rendering Strategies in Next.js

## Executive Summary

**Test Date:** December 8, 2025  
**Environment:** Next.js 15.5.5, React 19, Node.js 24.11.1  
**Test Types:** Lighthouse (UX metrics) + K6 (Load testing)  
**Network Simulation:** Slow 4G (Mobile)  
**Total Test Samples:** 24 Lighthouse samples + 2 K6 load tests

---

## 1. Bundle Size Analysis

**Finding: All rendering strategies produce identical bundle sizes**

| Page | Strategy | Total Bundle Size |
|------|----------|-------------------|
| Home | SSR/CSR/SSG/ISR | 821 KB |
| List | SSR/CSR/SSG/ISR | 681 KB |

**Shared Framework:** 352.6 KB (React + Next.js core)

**Critical Insight:** The "Hydration Tax" observed in TBT measurements is not attributable to bundle size differences but rather to execution time overhead during the hydration process.

---

## 2. Lighthouse Performance Metrics

**Note:** All values represent averages from 3 test runs per strategy.

### HOME Page (Complex - animations, hero, product grid)

| Strategy | Score | TTFB | FCP | LCP | SI | TBT | CLS |
|----------|-------|------|-----|-----|----|----|-----|
| **SSR** | 74 | 148ms | 858ms | 1133ms | 1050ms | **1537ms** | 0.001 |
| **CSR** | 73 | **1ms** | 2080ms | 2559ms | 2122ms | **1011ms** | 0.001 |
| **SSG** | 72 | 6ms | **692ms** | **959ms** | **882ms** | 2127ms | 0.001 |
| **ISR** | 72 | 6ms | 702ms | 964ms | 902ms | 2044ms | 0.001 |

### LIST Page (Simpler - product listing only)

| Strategy | Score | TTFB | FCP | LCP | SI | TBT | CLS |
|----------|-------|------|-----|-----|----|----|-----|
| **SSR** | 99 | 318ms | 791ms | 791ms | 795ms | 108ms | 0.000 |
| **CSR** | **100** | **1ms** | 1368ms | 1397ms | 1324ms | **0ms** | 0.000 |
| **SSG** | 96 | 3ms | **477ms** | **477ms** | **484ms** | 212ms | 0.000 |
| **ISR** | 97 | 3ms | 480ms | 480ms | 488ms | 204ms | 0.000 |

---

## 3. K6 Load Testing Results

**Test Configuration:** Progressive load ramping from 10 to 200 concurrent users over 4 minutes

**Note:** Metrics represent aggregated results from the entire 4-minute load test per strategy.

### SSR Performance Under Load

| Metric | Value |
|--------|-------|
| **Total Requests** | 13,707 |
| **Throughput** | 56.89 req/s |
| **Avg Response Time** | 346ms |
| **p50 (Median)** | 342ms |
| **p95** | 400ms |
| **p99** | - |
| **Max Response Time** | 479ms |
| **Error Rate** | 0% |
| **Max Concurrent VUs** | 199 |

### ISR Performance Under Load

| Metric | Value |
|--------|-------|
| **Total Requests** | 18,297 |
| **Throughput** | **76.03 req/s** (+34%) |
| **Avg Response Time** | **3.6ms** (99% improvement) |
| **p50 (Median)** | **3.1ms** |
| **p95** | **8.2ms** |
| **p99** | - |
| **Max Response Time** | **27ms** |
| **Error Rate** | 0% |
| **Max Concurrent VUs** | 199 |

### Key Load Testing Findings

**ISR demonstrates substantially superior performance compared to SSR under load:**

1. **Throughput:** ISR handles 34% more requests per second (76 vs 57 req/s)
2. **Response Time:** ISR achieves 99% faster average response times (3.6ms vs 346ms)
3. **Scalability:** ISR maintains sub-10ms response times at 200 concurrent users
4. **Server Resource Utilization:** ISR serves cached pages while SSR requires rendering computation per request

**Analysis:** These results demonstrate that SSR incurs significant server-side overhead and exhibits scalability limitations compared to ISR's cache-first architecture.

---

## 4. Findings Summary

### The SSR Trade-off

**Advantages:**
- Consistent performance across page complexity (scores: 74-99)
- Balanced metrics for varying content types
- Well-suited for dynamic, frequently updated content

**Disadvantages:**
- 25-150x higher TTFB (148-318ms vs 1-6ms)
- 34% lower throughput compared to ISR (56.89 vs 76.03 req/s)
- 99% slower response time under load (346ms vs 3.6ms)
- Non-negligible server CPU cost per request
- Constrained horizontal scalability

### The CSR Paradox

**Advantages:**
- Minimal TTFB (1ms) due to static HTML delivery
- Lowest TBT on simple pages (0ms list page, 1011ms home page)
- Near-perfect Lighthouse score on simple pages (100)

**Disadvantages:**
- Worst LCP performance (2.6s on complex pages)
- Suboptimal initial SEO due to JavaScript-dependent content
- Delayed content rendering leading to poor perceived performance

### The Static Advantage - SSG/ISR

**Advantages:**
- Fastest paint times (FCP: 477-692ms, LCP: 477-959ms)
- Near-instantaneous TTFB (3-6ms)
- Superior scalability with 34% higher throughput than SSR
- 99% faster response times under load due to cached responses
- Optimal initial user experience

**Disadvantages:**
- Highest TBT on complex pages (2000-2100ms)
- Unavoidable hydration overhead

---

## 5. The "No Free Lunch" Problem

### The Hydration Tax: Empirical Evidence

**Observations with pre-rendered static HTML (SSG/ISR):**

1. Browser downloads 821KB JavaScript bundle
2. React re-executes all component logic client-side
3. Virtual DOM is reconstructed from scratch
4. Event listeners are attached to the entire component tree
5. **Result: Over 2 seconds of main thread blocking time on complex pages**

**Home Page TBT Measurements:**
- SSG: 2127ms
- ISR: 2044ms
- CSR: 1011ms (reduced initial hydration burden)

**Analysis:** This hydration overhead is fundamental to the React/Next.js architecture, not a defect or misconfiguration. It represents an inherent trade-off in frameworks that employ full-page hydration.

---

## 6. Load Testing Analysis

**Key Metrics Validated:**
- **Max Concurrent Users:** ISR demonstrates superior capacity under concurrent load
- **Server CPU Utilization:** SSR requires per-request rendering computation, while ISR serves from cache
- **Average Request Duration:** 346ms (SSR) vs 3.6ms (ISR)

**Empirical Observations:**
- SSR exhibits scalability constraints relative to ISR
- ISR's cache-first architecture delivers 99% faster response times
- At 200 concurrent users, ISR maintains sub-10ms responses while SSR response times degrade to 400-479ms

---

## 7. Data-Driven Recommendations

### E-commerce and Content-Heavy Sites
**Recommended Strategy: SSG/ISR**
- Fastest initial load times (LCP: 477-959ms)
- Superior scalability (76 req/s vs 57 req/s)
- 99% faster response times under load
- Trade-off: Accept 2s hydration overhead or consider Islands Architecture frameworks

### Web Applications (Dashboards, SaaS)
**Recommended Strategy: SSR or CSR**
- Hydration overhead is acceptable given the need for full SPA interactivity
- Complex state management benefits from complete framework availability
- ISR/SSG unsuitable for real-time, personalized data requirements

### High-Traffic Public Sites
**Recommended Strategy: ISR (avoid SSR)**
- SSR demonstrates proven scalability limitations under concurrent load
- ISR provides 34% higher throughput
- 99% faster response times reduce infrastructure requirements
- Lower server resource consumption (CPU/memory)

---

## 8. Analysis of Key Performance Patterns

### The TTFB Bottleneck in SSR
- Measured TTFB: 148-318ms (SSR) vs <10ms (static strategies)
- Load test average: 346ms (SSR) vs 3.6ms (ISR)
- Conclusion: Server-side rendering introduces substantial latency per request

### The LCP Penalty in CSR
- Measured LCP: 2559ms (CSR) vs 959ms (SSG) on home page
- Conclusion: Client-side rendering significantly delays content visibility

### Static Strategy Performance Benefits
- Fastest FCP/LCP metrics across all test pages
- Load test throughput: 76 req/s (ISR) vs 57 req/s (SSR)
- Conclusion: Pre-rendered strategies demonstrate clear performance advantages

### The Hydration Overhead
- Measured TBT: 2127ms (SSG), 2044ms (ISR) on complex home page
- Bundle sizes identical across strategies (821KB)
- Conclusion: Hydration cost is execution-bound, not payload-bound

### Implications for Framework Selection

The data demonstrates that React/Next.js architectures require full hydration regardless of pre-rendering strategy. This finding supports the consideration of alternative architectures such as **Islands Architecture** (Astro, Qwik) or **React Server Components** for content-heavy applications that demand both rapid initial load times and responsive interactivity.

---

## 9. Final Metrics Summary Table

### Lighthouse Performance (3 samples averaged)

| Page | Strategy | Score | TTFB | LCP | TBT |
|------|----------|-------|------|-----|-----|
| Home | SSR | 74 | 148ms | 1133ms | 1537ms |
| Home | CSR | 73 | 1ms | 2559ms | 1011ms |
| Home | SSG | 72 | 6ms | **959ms** | 2127ms |
| Home | ISR | 72 | 6ms | 964ms | 2044ms |
| List | SSR | 99 | 318ms | 791ms | 108ms |
| List | CSR | **100** | **1ms** | 1397ms | **0ms** |
| List | SSG | 96 | 3ms | **477ms** | 212ms |
| List | ISR | 97 | 3ms | 480ms | 204ms |

### K6 Load Testing (200 concurrent users, 4 min test)

| Strategy | Requests | Throughput | Avg Response | p95 | Error Rate |
|----------|----------|------------|--------------|-----|------------|
| **SSR** | 13,707 | 56.89 req/s | 346ms | 400ms | 0% |
| **ISR** | 18,297 | **76.03 req/s** | **3.6ms** | **8.2ms** | 0% |

**ISR Advantage:** +34% throughput, 99% faster response

### Bundle Sizes

| Page | Size (all strategies) |
|------|-----------------------|
| Home | 821 KB |
| List | 681 KB |

---

## 10. Conclusion

This empirical study provides comprehensive quantitative evidence for the following observations:

1. **SSR TTFB and Scalability Constraints:** SSR demonstrates 34% lower throughput and 99% slower response times under concurrent load compared to ISR
2. **CSR Content Visibility Delay:** CSR exhibits significantly delayed content rendering, with 2.6s LCP on complex pages
3. **SSG/ISR First Paint Performance:** Static generation strategies consistently deliver the fastest FCP and LCP metrics
4. **Hydration Overhead:** Static strategies incur over 2 seconds of TBT on complex pages despite pre-rendered HTML
5. **ISR Scalability Benefits:** ISR's cache-first architecture demonstrates superior horizontal scalability

**Summary:** The React/Next.js hydration model exhibits fundamental trade-offs. For content-heavy applications requiring both optimal initial load performance and responsive interactivity, alternative architectures warrant consideration, including **Islands Architecture** (Astro, Qwik) and **React Server Components**.

---

**Status:** All planned testing and analysis completed. Results provide empirical validation for the theoretical framework presented in the accompanying presentation materials.
