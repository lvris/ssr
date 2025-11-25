import { useState, useMemo } from "react";
import { DemoItem } from "@/interfaces/Demo.interface";
import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";
import { CartProvider } from "@/util/cart_context";

interface ProductGridProps {
  items: DemoItem[];
}

function ProductGridInner({ items }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  const filteredAndSorted = useMemo(() => {
    let result = [...items];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [items, searchQuery, sortBy]);

  return (
    <div>
      <SearchBar onSearch={setSearchQuery} onSortChange={setSortBy} />

      <div className="container mx-auto px-4 py-6">
        {/* Results count */}
        <p className="text-base-content/60 mb-4">
          Showing {filteredAndSorted.length} of {items.length} products
        </p>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredAndSorted.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-base-content/50">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductGrid({ items }: ProductGridProps) {
  return (
    <CartProvider>
      <ProductGridInner items={items} />
    </CartProvider>
  );
}
