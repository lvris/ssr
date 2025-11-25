import { useState } from "react";
import Image from "next/image";
import { DemoItem } from "@/interfaces/Demo.interface";
import { useCart } from "@/util/cart_context";
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar } from "react-icons/fa";

interface ProductCardProps {
  item: DemoItem;
}

export default function ProductCard({ item }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }
    setQuantity(1);
  };

  // Generate random rating for demo
  const rating = (item.id % 5) + 1;
  const reviews = (item.id * 7) % 100 + 10;

  return (
    <div
      className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <figure className="relative aspect-square overflow-hidden">
        <Image
          src={`https://picsum.photos/id/${item.id + 10}/400/400`}
          alt={item.name}
          fill
          className={`object-cover transition-transform duration-300 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />

        {/* Favorite Button */}
        <button
          className={`absolute top-3 right-3 btn btn-circle btn-sm ${
            isFavorite ? "btn-error" : "btn-ghost bg-base-100/80"
          }`}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>

        {/* Quick Add Overlay */}
        <div
          className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            className="btn btn-primary gap-2"
            onClick={handleAddToCart}
          >
            <FaShoppingCart />
            Quick Add
          </button>
        </div>
      </figure>

      {/* Card Body */}
      <div className="card-body p-4">
        <h3 className="card-title text-base line-clamp-1">{item.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < rating ? "text-warning" : "text-base-300"}
              size={14}
            />
          ))}
          <span className="text-xs text-base-content/60 ml-1">({reviews})</span>
        </div>

        {/* Price */}
        <p className="text-xl font-bold text-primary">${item.price.toFixed(2)}</p>

        {/* Quantity & Add to Cart */}
        <div className="flex items-center gap-2 mt-2">
          <div className="join">
            <button
              className="join-item btn btn-sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="join-item input input-sm input-bordered w-14 text-center"
              min={1}
            />
            <button
              className="join-item btn btn-sm"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
          <button
            className="btn btn-primary btn-sm flex-1 gap-1"
            onClick={handleAddToCart}
          >
            <FaShoppingCart size={12} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
