import {ServicesCards} from "./ServicesCards";
import {ServicesHeader} from "./ServicesHeader";
import styles from "./ServiceSection.module.css";

const ServiceSection = () =>
{
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<ServicesHeader />
			</div>
			<div className={styles.content}>
				<h3>
					<ServicesCards />
				</h3>
			</div>
		</div>
	)
}

export default ServiceSection