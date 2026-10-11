import Reveal from './Reveal'

export default function Blog() {
  return (
    <section id="blog" className="navy">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow gold">Blog</span>
          <h2>Latest from SAHAS</h2>
        </Reveal>

        <Reveal as="article" className="post">
          <div className="post-date" aria-label="July 2, 2026">
            <span>July</span>
            <b>02</b>
            <span>2026</span>
          </div>
          <div>
            <span className="post-tag">Health Awareness</span>
            <h3>Health &amp; Hygiene Camp for Tribal Women, Panvel</h3>
            <p>
              A Health &amp; Hygiene Camp for tribal women was held at Madhuban Agro Farms in Dhodhani, Panvel, on July 2, 2026, with a focus on health awareness for the Katkari and Thakar communities.
            </p>
            <dl className="post-facts">
              <div>
                <dt>Venue</dt>
                <dd>Madhuban Agro Farms, Dhodhani</dd>
              </div>
              <div>
                <dt>Area</dt>
                <dd>Panvel</dd>
              </div>
              <div>
                <dt>Communities</dt>
                <dd>Katkari &amp; Thakar</dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
