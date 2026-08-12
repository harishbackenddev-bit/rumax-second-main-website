import { trustFeatures } from "@/data/site";
import { AssetImage } from "@/components/ui/AssetImage";

export function Trust() {
  return (
    <section className="trust section">
      <div className="container trust__inner">
        <div className="trust__media">
          <AssetImage name="rumax-trust-photo.png" alt="Care professional supporting an elderly client at home" />
        </div>
        <div className="trust__content">
          <h2>
            <AssetImage className="section-mark section-mark--trust" name="rumax-trust-mark.svg" aria-hidden="true" />
            Why Clients Trust Rumax
          </h2>
          <p className="lead">
            Rumax is a trusted provider of home care and clinical support services across the UK. We are committed to delivering
            high-quality, person-centred care that empowers individuals to live independently while receiving the support they need.
          </p>
          <div className="feature-grid">
            {trustFeatures.map((feature) => (
              <div className="feature" key={feature.title}>
                <AssetImage className="feature__icon" name={feature.icon} aria-hidden="true" />
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <a className="primary-btn" href="#">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
