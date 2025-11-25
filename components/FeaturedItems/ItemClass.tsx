import Image from "next/image";
import { formatPrice } from "@/util/helpers";
import { FaSearch } from "react-icons/fa";
import { DemoItem } from "@/interfaces/Demo.interface";
import styles from "./FeaturedItems.module.css";

const Item: React.FC<{ item: DemoItem }> = ({ item }) => {
  const { id, name, price } = item;
  const image = `https://picsum.photos/id/${id}/400/300`;
  return (
    <div>
      <div className={styles.itemContainer}>
        <Image src={image} alt={name} width={500} height={500} className={styles.itemPreview} />
        <div className={styles.itemOverlay}>
          <div className={styles.searchIcon}>
            <FaSearch />
          </div>
          View this product
        </div>
      </div>
      <footer>
        <h5>{name}</h5>
        <p>{formatPrice(price)}</p>
      </footer>
    </div>
  );
};

export default Item;
