import React from 'react';
import {formatPrice} from "@/util/helpers";
import {FaSearch} from "react-icons/fa";
import {DemoItem} from "@/interfaces/Demo.interface";
import styles from "./FeaturedItems.module.css";

const Item: React.FC<{item: DemoItem }> = ({item}) =>
{
  const {id, name, price} = item;
  const image = `https://picsum.photos/id/${id}/400/300`;

  return (
    <div>
      <div className={styles.itemContainer}>
          <a href="/csr" className={styles.itemHighlight}>
            <img src={image} alt={name} className={styles.itemPreview}/>
            <div className={styles.itemOverlay}>
              <div className={styles.itemHighlight}>View this product</div>
            </div>
          </a>
      </div>
      <footer>
        <h5>{name}</h5>
        <p>{formatPrice(price)}</p>
      </footer>
    </div>
  );
}

export default Item