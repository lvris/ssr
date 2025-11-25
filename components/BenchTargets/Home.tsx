import { BenchmarkProps, BenchMeta } from "@/lib/bench/types";
import { DemoItem } from "@/interfaces/Demo.interface";
import { fetchMockData } from "@/mocks/mock";
import HeroSection from "@/components/HomePage/HeroSection";
import ProductGrid from "@/components/HomePage/ProductGrid";
import TransactionCounter from "@/components/HomePage/TransactionCounter";
import ServiceSection from "@/components/HomePage/ServiceSection";
import HomepageDock from "@/components/HomePage/HomepageDock";

// Homepage with high-interactivity product grid
// Uses real product data to test hydration performance

export default function Home({ items, renderMode }: BenchmarkProps<DemoItem>) {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="flex h-[45vh] min-h-[280px]">
        <HeroSection />
        <TransactionCounter />
        <ServiceSection />
      </div>

      <section className="py-4">
        <ProductGrid items={items} />
      </section>

      <HomepageDock />
    </div>
  );
}

export const benchMeta: BenchMeta<DemoItem> = {
  serverFetch: async () => {
    // Fetch all products for SSR/SSG/ISR
    const items = await fetchMockData(100);
    return { items };
  },
  clientFetch: async () => {
    // CSR fetches from API
    const res = await fetch("/api/list");
    const items = await res.json();
    return { items };
  },
};
