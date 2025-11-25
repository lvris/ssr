import styles from "./HeroSection.module.css";

export const HeroShopButton = () => {
  return (
    <div className={styles.btnContainer}>
      <button className={styles.btn}>Shop Now</button>
    </div>
  );
};
