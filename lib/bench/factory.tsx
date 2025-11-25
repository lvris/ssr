import React, { ComponentType, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetStaticProps } from 'next';
import { BenchmarkProps, BenchMeta } from './types';

/**
 * Default adapter - passthrough props
 */
const defaultAdapter = <T,>(props: T): T => props;

// ============ SSR ============

export function createSSRPage(
    Component: ComponentType<any>,
    meta: BenchMeta<unknown>
) {
    const adapter = meta.adapter || defaultAdapter;

    const Page = (props: BenchmarkProps<unknown>) => <Component {...adapter(props)} />;

    const getServerSideProps: GetServerSideProps<BenchmarkProps<unknown>> = async () => {
        const { items } = await meta.serverFetch();
        return {
            props: { items, renderMode: 'SSR' }
        };
    };

    return { Page, getServerSideProps };
}

// ============ SSG ============

export function createSSGPage(
    Component: ComponentType<any>,
    meta: BenchMeta<unknown>
) {
    const adapter = meta.adapter || defaultAdapter;

    const Page = (props: BenchmarkProps<unknown>) => <Component {...adapter(props)} />;

    const getStaticProps: GetStaticProps<BenchmarkProps<unknown>> = async () => {
        const { items } = await meta.serverFetch();
        return {
            props: { items, renderMode: 'SSG', buildTime: new Date().toISOString() }
        };
    };

    return { Page, getStaticProps };
}

// ============ ISR ============

export function createISRPage(
    Component: ComponentType<any>,
    meta: BenchMeta<unknown>
) {
    const adapter = meta.adapter || defaultAdapter;
    const revalidate = meta.revalidate || 60;

    const Page = (props: BenchmarkProps<unknown>) => <Component {...adapter(props)} />;

    const getStaticProps: GetStaticProps<BenchmarkProps<unknown>> = async () => {
        const { items } = await meta.serverFetch();
        return {
            props: { items, renderMode: 'ISR', buildTime: new Date().toISOString() },
            revalidate
        };
    };

    return { Page, getStaticProps };
}

// ============ CSR ============

export function createCSRPage(
    Component: ComponentType<any>,
    meta: BenchMeta<unknown>
) {
    const adapter = meta.adapter || defaultAdapter;

    const Page = () => {
        const router = useRouter();
        const [items, setItems] = useState<unknown[]>([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            if (!router.isReady) return;
            
            meta.clientFetch()
                .then(({ items }: { items: unknown[] }) => {
                    setItems(items);
                    setLoading(false);
                });
        }, [router.isReady]);

        if (loading) {
            return <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>;
        }

        const props: BenchmarkProps<unknown> = { items, renderMode: 'CSR' };
        return <Component {...adapter(props)} />;
    };

    return { Page };
}