import {useFilterContext} from "@/util/filter_context";
import {services} from "@/mocks/Services/data";

export const ServicesCards = () =>
{
  const {updateFilters, handleClickFromServices, clearFilters} = useFilterContext()

  return (
    <div className="services-center">
      {services.map(({id, icon, title, text}) =>
      {
        return (
          <article key={id} className="service">
            <span className='icon'>{icon}</span>
            <h4>{title}</h4>
            <a href="/csr">
              <button
                className="btn"
                type="button"
                name="home-page-category"
                value={title}
                onClick={e =>
                {
                  clearFilters()
                  handleClickFromServices()
                  updateFilters(e)
                }}
              >
                Browse for {text}
              </button>
            </a>
          </article>
        )
      })}
    </div>
  )
}