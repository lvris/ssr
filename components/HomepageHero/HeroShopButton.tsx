import styles from "./HeroSection.module.css";

export const HeroShopButton = () =>
{
	return (
		<div className={styles.btnContainer}>
			<a href="/csr" className={styles.btn}>Shop Now (CSR)</a>
			<a href="/ssr" className={styles.btn}>Shop Now (SSR)</a>
		</div>
	);
}