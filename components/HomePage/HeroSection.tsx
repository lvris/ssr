import React from "react";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="flex-1 min-w-0 bg-sky-100 p-6 flex flex-col items-center justify-center text-center">
      <Image
        src="/hero_image.jpg"
        alt="hero"
        width={150}
        height={150}
        className="rounded-full mb-3"
      />
      <h2 className="text-lg font-semibold text-slate-800 mb-2">
        Welcome to Our Store
      </h2>
      <p className="text-sm text-slate-600 max-w-xs">
        Discover amazing products at unbeatable prices
      </p>
    </div>
  );
};

export default HeroSection;
