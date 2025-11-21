import HeroSection from "@/components/HeroSection";
import FeaturedItem from "@/components/FeaturedItems/FeaturedItems";
import ServiceSection from "@/components/Services/ServiceSection";

export default function Home() {
	return (
		<div className="min-h-screen bg-base-200">
			<HeroSection />
      <FeaturedItem />
      <ServiceSection />
		</div>
	);
}
