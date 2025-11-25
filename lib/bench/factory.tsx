import React, { ComponentType, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps, GetStaticProps } from "next";
import { BenchmarkProps, BenchMeta } from "./types";
import BenchHeader from "@/components/Benchmark/BenchHeader";

/**
 * Default adapter - passthrough props
 */
const defaultAdapter = <T,>(props: T): T => props;

// ============ SSR ============

export function createSSRPage<T>(
  Component: ComponentType<BenchmarkProps<T>>,
  meta: BenchMeta<T>
) {
  const adapter = meta.adapter || defaultAdapter;

  const Page = (props: BenchmarkProps<T>) => (
    <>
      <BenchHeader renderMode={props.renderMode} buildTime={props.buildTime} />
      <Component {...adapter(props)} />
    </>
  );

  const getServerSideProps: GetServerSideProps<
    BenchmarkProps<T>
  > = async () => {
    const { items } = await meta.serverFetch();
    return {
      props: { items, renderMode: "SSR" },
    };
  };

  return { Page, getServerSideProps };
}

// ============ SSG ============

export function createSSGPage<T>(
  Component: ComponentType<BenchmarkProps<T>>,
  meta: BenchMeta<T>
) {
  const adapter = meta.adapter || defaultAdapter;

  const Page = (props: BenchmarkProps<T>) => (
    <>
      <BenchHeader renderMode={props.renderMode} buildTime={props.buildTime} />
      <Component {...adapter(props)} />
    </>
  );

  const getStaticProps: GetStaticProps<BenchmarkProps<T>> = async () => {
    const { items } = await meta.serverFetch();
    return {
      props: { items, renderMode: "SSG", buildTime: new Date().toISOString() },
    };
  };

  return { Page, getStaticProps };
}

// ============ ISR ============

export function createISRPage<T>(
  Component: ComponentType<BenchmarkProps<T>>,
  meta: BenchMeta<T>
) {
  const adapter = meta.adapter || defaultAdapter;
  const revalidate = meta.revalidate || 60;

  const Page = (props: BenchmarkProps<T>) => (
    <>
      <BenchHeader renderMode={props.renderMode} buildTime={props.buildTime} />
      <Component {...adapter(props)} />
    </>
  );

  const getStaticProps: GetStaticProps<BenchmarkProps<T>> = async () => {
    const { items } = await meta.serverFetch();
    return {
      props: { items, renderMode: "ISR", buildTime: new Date().toISOString() },
      revalidate,
    };
  };

  return { Page, getStaticProps };
}

// ============ CSR ============

export function createCSRPage<T>(
  Component: ComponentType<BenchmarkProps<T>>,
  meta: BenchMeta<T>
) {
  const adapter = meta.adapter || defaultAdapter;

  const Page = () => {
    const router = useRouter();
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!router.isReady) return;

      meta.clientFetch().then(({ items }) => {
        setItems(items);
        setLoading(false);
      });
    }, [router.isReady]);

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      );
    }

    const props: BenchmarkProps<T> = { items, renderMode: "CSR" };
    return (
      <>
        <BenchHeader renderMode="CSR" />
        <Component {...adapter(props)} />
      </>
    );
  };

  return { Page };
}
