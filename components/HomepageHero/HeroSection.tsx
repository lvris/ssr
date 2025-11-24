import React from "react";
import {HeroText} from "@/components/HomepageHero/HeroText";
import {HeroShopButton} from "@/components/HomepageHero/HeroShopButton";
import {HeroImage} from "@/components/HomepageHero/HeroImage";
import styles from "./HeroSection.module.css";

const HeroSection = () =>
{
	return (
		<div className={styles.container}>
			<div className={styles.container1}>
				<div className={styles.heroText}>
					<HeroText />
				</div>
				<div className={styles.heroButton}>
					<HeroShopButton />
				</div>
			</div>

			<div className={styles.heroImage}>
				<HeroImage />
			</div>
		</div>
	)
}

export default HeroSection;