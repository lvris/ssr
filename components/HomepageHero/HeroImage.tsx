import heroImg from "@/assets/hero_image.jpg";

export const HeroImage = () =>
{
	return (
		<article className="img-container">
			<img src={heroImg.src} alt="hero" className="main-img" />
			{/* insert one more image here */}
		</article>
	);
}