import React, {useEffect, useState} from "react";
import Item from "@/components/FeaturedItems/ItemClass";
import {DemoItem} from "@/interfaces/Demo.interface";
import {fetchMockData} from "@/mocks/mock";

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
    <div className='section-center featured'>
      {randItemArr && randItemArr.map(itemElem =>
          (
            <Item key={itemElem.id} item={itemElem} />
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