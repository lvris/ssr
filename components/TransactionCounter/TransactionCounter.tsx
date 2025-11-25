import { useState, useEffect } from "react";
import Counter from "./Counter";
import styles from "./TransactionCounter.module.css";

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
    <div className={styles.container}>
      <h2 className={styles.header}>purchases made today</h2>
      <div className={styles.header}>
        <Counter
          value={count}
          places={[100, 10, 1]}
          fontSize={80}
          padding={5}
          gap={10}
          textColor="black"
          fontWeight={900}
        />
      </div>
    </div>
  );
};

export default TransactionCounter;
