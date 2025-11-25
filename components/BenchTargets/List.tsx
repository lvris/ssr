import { BenchmarkProps, BenchMeta } from "@/lib/bench/types";
import { fetchMockData } from "@/mocks/mock";
import { DemoItem } from "@/interfaces/Demo.interface";
import Image from "next/image";

const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

interface ProductCardProps {
  item: DemoItem;
  priority?: boolean;
}

function ProductCard({ item, priority = false }: ProductCardProps) {
  return (
    <div
      className="card w-full bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-200"
      data-testid={`product-card-${item.id}`}
    >
      <figure className="relative">
        <Image
          src={`/${item.id}.jpg`}
          alt={`Product ${item.id}`}
          width={400}
          height={300}
          className="w-full h-48 object-cover"
          priority={priority}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
      </figure>
      <div className="card-body p-4">
        <h3
          className="card-title text-base font-semibold line-clamp-2"
          title={item.name}
        >
          {item.name}
        </h3>
        <div className="flex justify-between items-center mt-2">
          <p className="text-lg font-bold text-error">${item.price}</p>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => console.log(`Clicked product ${item.id}`)}
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductGrid({ items }: { items: DemoItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {items.map((item, index) => (
        <ProductCard key={item.id} item={item} priority={index < 10} />
      ))}
    </div>
  );
}

export default function List({ items }: BenchmarkProps<DemoItem>) {
  return (
    <div className="min-h-screen bg-base-200 pt-4">
      <div className="container mx-auto px-4 lg:px-8 pb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-base-content">
            Product Listings
          </h2>
        </div>
        <ProductGrid items={items} />
      </div>
    </div>
  );
}

export const benchMeta: BenchMeta<DemoItem> = {
  serverFetch: async () => {
    const data = await fetchMockData();
    return { items: data };
  },
  clientFetch: async () => {
    const res = await fetch("/api/list");
    const data = await res.json();
    return { items: data };
  },
};
