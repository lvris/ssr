import React, {useEffect, useState} from "react";
import Item from "@/components/FeaturedItems/ItemClass";
import {DemoItem} from "@/interfaces/Demo.interface";
import {fetchMockData} from "@/mocks/mock";
import styles from "./FeaturedItems.module.css";

export const FeaturedItemsCards = () =>
{
  const [itemArr, setItems] = useState<DemoItem[]>([]);
  useEffect(() =>
    {
        // fetch('/api/data')
        fetchMockData().then(data => setItems(data))
    }, []
  );

  let randItemArr = getRandomItemArr(itemArr, 3);

  return (
    <div className={styles.cards}>
      {randItemArr && randItemArr.map(itemElem =>
          (
            <div className="card w-full bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <Item key={itemElem.id} item={itemElem} />
            </div>
          )
        )
      }
    </div>
  );
}

const getRandomItemArr = <T extends unknown> (arr: T[], n: number): T[] =>
{
  const shuffled = Array.from(arr).sort(() => 0.5 - Math.random());

  return shuffled.slice(0, n);
};