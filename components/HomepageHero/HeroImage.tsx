import heroImg from "@/assets/hero_image.jpg";
import styles from "./HeroSection.module.css";

export const HeroImage = () =>
{
	return (
		<article className="img-container">
			<img src={heroImg.src} alt="hero" className={styles.image}/>
		</article>
	);
}