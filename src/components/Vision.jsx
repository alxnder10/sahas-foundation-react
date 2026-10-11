import { VISION } from '../data'
import Reveal from './Reveal'

export default function Vision() {
  return (
    <section className="navy" id="vision">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow gold">Who we are</span>
          <h2>SAHASIs</h2>
          <p className="tagline">Making life a little easier</p>
        </Reveal>

        <Reveal as="blockquote" className="quote-block">
          <p>&ldquo;If you want to find God, serve man. To reach Narayana you must serve the Daridra Narayanas &ndash; the starving millions of India&hellip;&rdquo;</p>
          <cite>Swami Vivekananda</cite>
        </Reveal>

        <Reveal className="prose-navy">
          <p>
            We at SAHAS, the SAHASIs, are doing our bit towards providing aid through necessary resources like education, care and support to the needy and underprivileged school kids; provide companionship to lonely elders as well as extend our hand to any specific need of the hour.
          </p>
          <p>
            All those young at heart, with social consciousness, can contribute in whichever capacity they wish, by being associated with the SAHASIs. Our aim is to rouse the Indians to an awareness of their obligations and responsibilities to the nation and through the nation to humanity at large.
          </p>
        </Reveal>

        <div className="vision-list">
          {VISION.map((v, i) => (
            <Reveal key={v.label} delay={i * 0.1} className="row">
              <span className="label">{v.label}</span>
              <p>{v.text}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="take-part">
          <p>Any Resident or Non Resident Indian who accepts the constitution of SAHAS can enroll as a member of SAHAS, as a life member or yearly member.</p>
          <a href="#donate" className="btn btn-line-invert">
            Know More
          </a>
        </Reveal>
      </div>
    </section>
  )
}
