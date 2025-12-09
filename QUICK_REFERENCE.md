# Quick Reference - Testing & Analysis Commands

## Prerequisites

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Generate benchmark pages:**
   ```bash
   npm run bench
   ```
   This creates 8 pages: `/bench/{home,list}/{ssr,csr,ssg,isr}`

3. **Build and start production server:**
   ```bash
   npm run build
   npm run start
   ```
   Server runs on `http://localhost:3333`

---

## Running Tests

### 1. Bundle Size Analysis
```bash
npm run bundle-size
```
**Purpose:** Analyze JavaScript bundle sizes for each rendering strategy  
**Output:** Console summary showing bundle sizes are identical across strategies  
**Duration:** < 1 second

### 2. Lighthouse Performance Tests
```bash
npm run lighthouse
```
**Purpose:** Measure Core Web Vitals (TTFB, FCP, LCP, SI, TBT, CLS) under Slow 4G network simulation  
**Requirements:** Server must be running on port 3333  
**Output:** Appends results to `lighthouse-results.csv`  
**Duration:** ~5 minutes (runs 5 iterations per strategy, tests all 8 pages)  
**Configuration:** Edit `scripts/lighthouse.js` to change number of runs or network throttling

### 3. K6 Load Testing
**K6 Must Be installed.**

**Run tests:**
```bash
npm run test:k6
```
**Purpose:** Measure scalability under concurrent load (SSR vs ISR comparison)  
**Requirements:** Server must be running on port 3333  
**Output:** Appends results to `k6-results.csv`  
**Duration:** ~8 minutes (tests SSR and ISR with 10→50→100→200 concurrent users)  
**Configuration:** Edit `scripts/run-k6-tests.js` to change strategies or `scripts/k6-load-test.js` for load stages

### 4. Data Analysis
```bash
npm run analyze
```
**Purpose:** Command-line summary of Lighthouse test results  
**Output:** Console display of averages by strategy and page  
**Requirements:** `lighthouse-results.csv` must exist

--- 

## Data Files

- `lighthouse-results.csv` - Raw Lighthouse test data (timestamp, page, strategy, all Core Web Vitals)
- `k6-results.csv` - Load testing metrics (created when k6 tests are run)
- `COMPLETE_ANALYSIS.md` - Comprehensive analysis report with all findings and test results
- `gen_figures.py` - Python script to generate publication-quality figures

---

## Generating Visualizations

### Python Figures (Publication Quality)
```bash
python gen_figures.py
```
**Output:** Creates three 300 DPI PNG files:
- `figure1_trilemma.png` - TTFB vs LCP vs TBT comparison
- `figure2_load_testing.png` - SSR vs ISR throughput and response time
- `figure3_hydration_tax.png` - Bundle size vs TBT scatter plot

**Requirements:** Python 3.12+ with matplotlib, numpy, pandas, seaborn

---

## Typical Testing Workflow

1. **Initial setup:**
   ```bash
   npm install
   npm run bench
   npm run build
   npm run start
   ```

2. **Run all tests (in separate terminal):**
   ```bash
   npm run bundle-size
   npm run lighthouse
   npm run test:k6
   ```

3. **Analyze results:**
   ```bash
   npm run analyze
   python gen_figures.py
   ```

4. **Review findings:**
   - Check console output from analyze command
   - Open `COMPLETE_ANALYSIS.md` for full report
   - View generated PNG figures

---

## Troubleshooting

 - note that running lighthouse requires chrome/chromium executable.

### K6 tests fail
```bash
# Verify k6 is installed
k6 version

# Ensure server is running on correct port
curl http://localhost:3333/bench/list/ssr
```


