import Image from "next/image";
import heroImg from "@/assets/hero_image.jpg";
import styles from "./HeroSection.module.css";

export const HeroImage = () =>
{
	return (
		<article className="img-container">
			<Image src={heroImg.src} alt="hero" width={1000} height={1000} className={styles.image}/>
		</article>
	);
}