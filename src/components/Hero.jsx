import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { asset, MARQUEE, STATS } from '../data'
import Counter from './Counter'
import Reveal from './Reveal'

const WORDS = ['For', 'a', 'better', 'tomorrow.']
const RAYS = Array.from({ length: 36 }, (_, i) => i)

function SunRays() {
  return (
    <svg viewBox="-200 -200 400 400" aria-hidden="true">
      {RAYS.map((i) => {
        const a = (i / RAYS.length) * Math.PI * 2
        const r1 = i % 3 === 0 ? 118 : 132
        const r2 = 168
        return (
          <line
            key={i}
            x1={Math.cos(a) * r1}
            y1={Math.sin(a) * r1}
            x2={Math.cos(a) * r2}
            y2={Math.sin(a) * r2}
            stroke="#df9328"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )
      })}
    </svg>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 70])

  return (
    <>
      <section className="hero" id="top" ref={ref}>
        <div className="wrap hero-grid">
          <div>
            <motion.span className="eyebrow" initial={reduce ? false : { opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              Spreading Aid Health And Smiles
            </motion.span>
            <h1 className="hero-title" aria-label="For a better tomorrow.">
              {WORDS.map((w, i) => (
                <span className="word-mask" key={w} aria-hidden="true">
                  <motion.span
                    className={'word' + (w === 'better' ? ' accent' : '')}
                    initial={reduce ? false : { y: '115%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.85, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              className="hero-lede"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              Education, care and companionship for underprivileged children, TB patients and lonely elders. A Mumbai society started by a small group of friends.
            </motion.p>
            <motion.div
              className="hero-cta"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.85 }}
            >
              <a href="#donate" className="btn btn-primary">
                Donate
              </a>
              <a href="#projects" className="btn btn-line">
                See our work
              </a>
            </motion.div>
          </div>

          <div className="hero-art">
            <motion.div
              className="sun-rays"
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 120, ease: 'linear', repeat: Infinity }}
            >
              <SunRays />
            </motion.div>
            <motion.figure
              className="hero-photo"
              style={{ y }}
              initial={reduce ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={asset('images/dharavi-art-kids.jpg')}
                alt="Children from the SAHAS Dharavi Art program with their artwork"
                width="1600"
                height="1200"
              />
              <motion.figcaption
                className="chip chip-a"
                animate={reduce ? undefined : { y: [0, -7, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                Dharavi Art program
              </motion.figcaption>
              <motion.span
                className="chip chip-b"
                animate={reduce ? undefined : { y: [0, 7, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                Est. 2019 · 80G tax-exempt
              </motion.span>
            </motion.figure>
          </div>
        </div>
      </section>

      <div className="action-bar">
        <div className="wrap">
          <p>Take action to help us grow</p>
          <a href="#donate" className="btn btn-primary">
            Donate
          </a>
        </div>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((n) => (
            <div className="marquee-group" key={n}>
              {MARQUEE.map((m) => (
                <span key={m}>
                  {m}
                  <i />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="wrap">
        <div className="stat-strip">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="stat">
              <div className="stat-num">{s.count ? <Counter to={s.count} suffix={s.suffix} /> : s.text}</div>
              <div className="stat-label">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  )
}
