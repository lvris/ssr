import HeroSection from "@/components/HomepageHero/HeroSection";
import FeaturedItem from "@/components/FeaturedItems/FeaturedItems";
import ServiceSection from "@/components/Services/ServiceSection";
import styles from "./HomePage.module.css";

export default function Home() {
	return (
		<div className={styles.container}>
			<div className={styles.hero}>
				<HeroSection/>
			</div>
			<div className={styles.featured}>
				<FeaturedItem/>
			</div>
			<div className={styles.services}>
				<ServiceSection/>
			</div>
		</div>
	);
}
