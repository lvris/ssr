/**
 * Benchmark Framework Type Definitions
 */

export type RenderMode = 'CSR' | 'SSR' | 'SSG' | 'ISR';

/**
 * Standard Benchmark Props - All tested components receive these props
 */
export interface BenchmarkProps<T> {
    items: T[];
    renderMode: RenderMode;
    buildTime?: string;
}

/**
 * Component-exported benchmark metadata
 */
export interface BenchMeta<T> {
    /** Server-side data fetching (used by SSR/SSG/ISR) */
    serverFetch: () => Promise<{ items: T[] }>;
    /** Client-side data fetching (used by CSR) */
    clientFetch: () => Promise<{ items: T[] }>;
    /** Transform BenchmarkProps to component's actual props (optional) */
    adapter?: (props: BenchmarkProps<T>) => BenchmarkProps<T>;
    /** ISR revalidate interval in seconds, default 60 */
    revalidate?: number;
}
