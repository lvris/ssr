// pages/medium_refresh.tsx
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";

import { fetchMockData } from "@/mocks/mock";
import type { DemoItem } from "@/interfaces/Demo.interface";

type Props = {
  items: DemoItem[];
  generatedAt: string;
};

export default function MediumRefreshPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { items, generatedAt } = props;

  return (
    <>
      <Head>
        <title>Medium Refresh</title>
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-2xl font-semibold">Medium-Refreshment Page (ISR)</h1>

        <p className="text-sm opacity-70">
          This page is statically generated but revalidated every{" "}
          <strong>60 seconds</strong>.
        </p>

        <div className="w-full max-w-xl border rounded-xl p-4 shadow">
          <h2 className="font-medium mb-2">Data</h2>
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(items, null, 2)}
          </pre>
        </div>

        <p className="text-xs opacity-60">
          Last generated at: <code>{generatedAt}</code>
        </p>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const items = await fetchMockData(300); 

  return {
    props: {
      items,
      generatedAt: new Date().toISOString(),
    },
    revalidate: 60, // seconds – change to whatever
  };
};