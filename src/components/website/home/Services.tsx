import { services } from "@/data/site";
import { AssetImage } from "@/components/ui/AssetImage";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function Services() {
  const homepageServices = services.slice(0, 3);

  return (
    <section className="services section">
      <SectionTitle
        className="services-title"
        mark="rumax-services-mark.svg"
        markClass="section-mark--services"
        title={
          <>
            Services tailored to meet the unique <strong>Needs of Each Client</strong>
          </>
        }
      />
      <div className="container services-grid">
        {homepageServices.map((service) => (
          <article className="service-card" key={service.number}>
            <AssetImage
              className={`service-card__icon${service.largeIcon ? " service-card__icon--large" : ""}`}
              name={service.icon}
              aria-hidden="true"
            />
            <div>
              <span className="service-card__number">{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <div className="tags">
                {service.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <a href={service.href}>Learn More</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
