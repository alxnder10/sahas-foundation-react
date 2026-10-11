import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PROJECTS } from '../data'
import Icon from './Icon'
import Reveal from './Reveal'

const FILTERS = ['All', 'Health', 'Education']

function ProjectCard({ p, open, onToggle }) {
  return (
    <motion.article
      layout="position"
      className={'proj-card' + (open ? ' open' : '')}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Icon name={p.icon} size={38} className="proj-icon" />
      <span className="proj-tag">{p.tag}</span>
      <h3>{p.title}</h3>
      <p className="proj-short">{p.short}</p>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="proj-more"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="proj-more-inner">
              {p.body.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
              <div className="proj-ask">
                <b>{p.ask.value}</b>
                <span>{p.ask.note}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="proj-actions">
        <button className="link-btn" aria-expanded={open} onClick={onToggle}>
          {open ? 'Show less' : 'Read more'}
        </button>
        <a className="more" href="#donate">
          {p.cta}
          <Icon name="arrow" size={15} strokeWidth={2} />
        </a>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const [openId, setOpenId] = useState(null)
  const list = PROJECTS.filter((p) => filter === 'All' || p.cats.includes(filter))

  return (
    <section id="projects">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">Our Projects</span>
          <h2>Where your support goes</h2>
        </Reveal>

        <Reveal className="chips" role="group" aria-label="Filter projects">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={'chip-btn' + (filter === f ? ' on' : '')}
              aria-pressed={filter === f}
              onClick={() => {
                setFilter(f)
                setOpenId(null)
              }}
            >
              {f}
            </button>
          ))}
        </Reveal>

        <motion.div className="proj-grid" layout="position">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <ProjectCard key={p.id} p={p} open={openId === p.id} onToggle={() => setOpenId(openId === p.id ? null : p.id)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
