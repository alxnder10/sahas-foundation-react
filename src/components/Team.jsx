import { motion } from 'framer-motion'
import { asset, TEAM } from '../data'
import Reveal from './Reveal'

export default function Team() {
  return (
    <section id="team" className="navy">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow gold">Committee Members</span>
          <h2>Our Current Members</h2>
        </Reveal>

        <div className="team-grid">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <motion.article className="team-card" whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
                {m.photo ? (
                  <img className="avatar-photo" src={asset(m.photo)} alt={m.name} width="500" height="734" />
                ) : (
                  <div className="avatar" aria-hidden="true">
                    {m.initials}
                  </div>
                )}
                <h3>{m.name}</h3>
                <p>{m.bio}</p>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
