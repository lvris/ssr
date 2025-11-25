import { BenchmarkProps, BenchMeta } from "@/lib/bench/types";
import HeroSection from "@/components/HomepageHero/HeroSection";
import FeaturedItems from "@/components/FeaturedItems/FeaturedItems";
import TransactionCounter from "@/components/TransactionCounter/TransactionCounter";
import ServiceSection from "@/components/Services/ServiceSection";
import HomepageDock from "@/components/HomepageDock/HomepageDock";

// Home page doesn't need items from server, it's mostly static content
// We use an empty array as placeholder to satisfy BenchmarkProps
interface HomeData {
  placeholder: boolean;
}

export default function Home({ renderMode }: BenchmarkProps<HomeData>) {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedItems />
      <TransactionCounter />
      <ServiceSection />
      <HomepageDock />
    </div>
  );
}

export const benchMeta: BenchMeta<HomeData> = {
  serverFetch: async () => {
    // Home page is mostly static, no real data fetch needed
    return { items: [{ placeholder: true }] };
  },
  clientFetch: async () => {
    return { items: [{ placeholder: true }] };
  },
};
