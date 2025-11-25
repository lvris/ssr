import { useState, useEffect } from "react";
import Counter from "./Counter";

function getRandNum(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const TransactionCounter = () => {
  const [count, setCount] = useState(getRandNum(50, 150));

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + getRandNum(1, 3));
    }, getRandNum(3000, 8000));

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 min-w-0 bg-emerald-800 p-6 flex flex-col items-center justify-center text-center">
      <h2 className="text-sm uppercase tracking-wider text-emerald-200 mb-3">
        Purchases Made Today
      </h2>
      <Counter
        value={count}
        places={[100, 10, 1]}
        fontSize={48}
        padding={4}
        gap={6}
        textColor="white"
        fontWeight={700}
      />
    </div>
  );
};

export default TransactionCounter;
