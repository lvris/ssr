import { useState } from "react";
import { useCart } from "@/util/cart_context";
import { FaShoppingCart, FaSearch, FaTimes } from "react-icons/fa";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSortChange: (sort: string) => void;
}

export default function SearchBar({ onSearch, onSortChange }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity } = useCart();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="sticky top-0 z-50 bg-base-200 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={handleSearch}
              className="input input-bordered w-full pl-10"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            className="select select-bordered"
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>

          {/* Cart Button */}
          <div className="relative">
            <button
              className="btn btn-primary gap-2"
              onClick={() => setShowCart(!showCart)}
            >
              <FaShoppingCart />
              <span className="badge badge-secondary">{totalItems}</span>
            </button>

            {/* Cart Dropdown */}
            {showCart && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-base-100 rounded-box shadow-xl p-4 z-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold">Shopping Cart</h3>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => setShowCart(false)}
                  >
                    <FaTimes />
                  </button>
                </div>

                {items.length === 0 ? (
                  <p className="text-center text-base-content/50 py-4">
                    Cart is empty
                  </p>
                ) : (
                  <>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 p-2 bg-base-200 rounded"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-xs text-primary">${item.price}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              className="btn btn-xs btn-ghost"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="w-6 text-center">{item.quantity}</span>
                            <button
                              className="btn btn-xs btn-ghost"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="btn btn-xs btn-error btn-ghost"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="divider my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Total:</span>
                      <span className="text-primary font-bold text-lg">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <button className="btn btn-primary w-full mt-3">
                      Checkout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
