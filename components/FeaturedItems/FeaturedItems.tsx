import React from "react";
import {FeaturedItemsHeader} from "@/components/FeaturedItems/FeaturedItemsHeader";
import {FeaturedItemsCards} from "@/components/FeaturedItems/FeaturedItemsCards";
import {FeaturedItemsButton} from "@/components/FeaturedItems/FeaturedItemsButton";
import styles from "./FeaturedItems.module.css";

const FeaturedItems = () =>
{
  return (
	<div className={styles.container}>
		<div className={styles.header}>
			<h2>
				<FeaturedItemsHeader />
			</h2>
		</div>
		<div className={styles.content}>
			<h3>
				<FeaturedItemsCards />
			</h3>
		</div>
		<div className={styles.footer}>
			<h4>
				<FeaturedItemsButton />
			</h4>
		</div>
	</div>
  );
}

export default FeaturedItems