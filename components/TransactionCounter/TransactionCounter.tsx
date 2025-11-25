import {useState, useEffect} from "react";
import Counter from "./Counter";
import styles from "./TransactionCounter.module.css";

const TransactionCounter = () =>
{
    var amount = 0;
    try
    {
        var amountStr = localStorage.getItem("purchases_made");
        if(amountStr !== null)
        {
            amount = +amountStr;
        }
    }
    catch(e)
    {
        console.error("TransactionCounter(): " + e);
    }
    const [count, setCount] = useState(amount);

    useEffect(() =>
    {
        const interval = setInterval(() =>
        {
            try
            {
                amount += getRandNum(1, 3);

                setCount((prevCount) => amount);
                localStorage.setItem("purchases_made", String(amount));
            }
            catch(e)
            {
                console.error("TransactionCounter(): " + e);
            }
        }, getRandNum(5000, 16000));

        return () => clearInterval(interval); 
    }, []); 

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>purchases made today</h2>
            <div className={styles.header}>
                <Counter value={count} places={[100, 10, 1]} fontSize={80} padding={5} gap={10} textColor="black" fontWeight={900}/>
            </div>
        </div>
    );
}

function getRandNum(min: number, max: number): number
{
  return Math.floor(Math.random()*(max - min + 1)) + min;
}

export default TransactionCounter