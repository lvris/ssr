import {useFilterContext} from "@/util/filter_context";
import {services} from "@/mocks/Services/data";
import styles from "./ServiceSection.module.css";

export const ServicesCards = () =>
{
  const {updateFilters, handleClickFromServices, clearFilters} = useFilterContext()

  return (
    <div className={styles.cardContainer}>
      {services.map(({id, icon, title, text}) =>
      {
        return (
          <div key={id} className={styles.card}>
            <span className={styles.icon}>{icon}</span>
            <a href="/csr">
              <button
                className={styles.btn}
                value={title}
                onClick={event =>
                {
                  clearFilters()
                  handleClickFromServices()
                  updateFilters(event)
                }}
              >
                Browse {text}
              </button>
            </a>
          </div>
        )
      })}
    </div>
  )
}