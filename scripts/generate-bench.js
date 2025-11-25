const fs = require('fs').promises;
const path = require('path');

const BENCH_TARGETS_DIR = 'components/BenchTargets';
const PAGES_OUT_DIR = 'pages/bench';
const MODES = ['csr', 'ssr', 'ssg', 'isr'];

async function ensureDir(dirPath) {
    await fs.mkdir(dirPath, { recursive: true });
}

async function scanBenchTargets(repoRoot) {
    const targetsDir = path.join(repoRoot, BENCH_TARGETS_DIR);
    const entries = await fs.readdir(targetsDir, { withFileTypes: true });
    
    const components = [];
    for (const entry of entries) {
        if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
            const name = entry.name.replace(/\.(tsx?|jsx?)$/, '');
            components.push({
                name: name.toLowerCase(),
                displayName: name,
                componentPath: `@/${BENCH_TARGETS_DIR}/${name}`,
            });
        }
    }
    return components;
}

/**
 * Generate page shim content
 */
function generateShimContent(componentPath, mode) {
    const factoryFn = {
        ssr: 'createSSRPage',
        ssg: 'createSSGPage',
        isr: 'createISRPage',
        csr: 'createCSRPage',
    }[mode];

    if (mode === 'ssr') {
        return `// Auto-generated benchmark shim - DO NOT EDIT
import Component, { benchMeta } from '${componentPath}';
import { ${factoryFn} } from '@/lib/bench/factory';

const { Page, getServerSideProps } = ${factoryFn}(Component, benchMeta);

export default Page;
export { getServerSideProps };
`;
    }
    
    if (mode === 'csr') {
        return `// Auto-generated benchmark shim - DO NOT EDIT
import Component, { benchMeta } from '${componentPath}';
import { ${factoryFn} } from '@/lib/bench/factory';

const { Page } = ${factoryFn}(Component, benchMeta);

export default Page;
`;
    }
    
    // SSG / ISR - no getStaticPaths needed for index.tsx
    return `// Auto-generated benchmark shim - DO NOT EDIT
import Component, { benchMeta } from '${componentPath}';
import { ${factoryFn} } from '@/lib/bench/factory';

const { Page, getStaticProps } = ${factoryFn}(Component, benchMeta);

export default Page;
export { getStaticProps };
`;
}

async function cleanGeneratedPages(repoRoot) {
    const pagesDir = path.join(repoRoot, PAGES_OUT_DIR);
    try {
        await fs.rm(pagesDir, { recursive: true, force: true });
        console.log('🧹 Cleaned old generated pages');
    } catch {
        // Directory doesn't exist, that's fine
    }
}

async function generate() {
    const repoRoot = path.resolve(__dirname, '..');
    
    // 1. Clean old generated pages
    await cleanGeneratedPages(repoRoot);
    
    // 2. Scan BenchTargets directory
    console.log('📂 Scanning', BENCH_TARGETS_DIR);
    const components = await scanBenchTargets(repoRoot);
    
    if (components.length === 0) {
        console.log('⚠️  No components found in', BENCH_TARGETS_DIR);
        return;
    }
    
    console.log(`📦 Found ${components.length} component(s):`, components.map(c => c.displayName).join(', '));
    
    // 3. Generate index.tsx for each component/mode
    for (const comp of components) {
        for (const mode of MODES) {
            const pageDir = path.join(repoRoot, PAGES_OUT_DIR, comp.name, mode);
            const pagePath = path.join(pageDir, 'index.tsx');
            
            await ensureDir(pageDir);
            const content = generateShimContent(comp.componentPath, mode);
            await fs.writeFile(pagePath, content, 'utf8');
        }
        console.log(`✅ Generated routes for ${comp.displayName} (${MODES.length} pages)`);
    }
    
    console.log('\n🎉 Generation complete!');
    console.log('\nGenerated routes:');
    for (const comp of components) {
        console.log(`  /bench/${comp.name}/csr`);
        console.log(`  /bench/${comp.name}/ssr`);
        console.log(`  /bench/${comp.name}/ssg`);
        console.log(`  /bench/${comp.name}/isr`);
    }
}

generate().catch(err => {
    console.error('❌ Generation failed:', err);
    process.exit(1);
});
