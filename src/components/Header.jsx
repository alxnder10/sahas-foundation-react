import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { NAV } from '../data'
import Icon from './Icon'

function Brand() {
  return (
    <a href="#top" className="brand">
      <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <circle cx="20" cy="20" r="19" stroke="#df9328" strokeWidth="1.4" />
        <path d="M12 23c1.6 3.4 4.6 5.4 8 5.4s6.4-2 8-5.4" stroke="#1c2a44" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M14 20c1.2-4 3.4-6 6-6s4.8 2 6 6" stroke="#1c2a44" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="20" cy="10.5" r="2" fill="#df9328" />
      </svg>
      <span className="brand-word">
        <b>SAHAS</b>
        <span>Foundation, Mumbai</span>
      </span>
    </a>
  )
}

export default function Header() {
  const [active, setActive] = useState('top')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 })

  useEffect(() => {
    const onScroll = () => {
      let current = NAV[0].id
      for (const { id } of NAV) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 140) current = id
      }
      setActive(current)
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={'site' + (scrolled ? ' scrolled' : '')}>
      <motion.div className="progress" style={{ scaleX }} />
      <div className="wrap nav-row">
        <Brand />
        <nav className="links" aria-label="Main">
          {NAV.map((n) => (
            <a key={n.id} href={'#' + n.id} className={active === n.id ? 'active' : ''}>
              {n.label}
            </a>
          ))}
          <a href="#donate" className="btn btn-primary">
            Donate
          </a>
        </nav>
        <button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <Icon name={open ? 'close' : 'menu'} size={24} strokeWidth={2} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-nav"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mobile-nav-inner">
              {NAV.map((n) => (
                <a key={n.id} href={'#' + n.id} onClick={() => setOpen(false)} className={active === n.id ? 'active' : ''}>
                  {n.label}
                </a>
              ))}
              <a href="#donate" className="btn btn-primary" onClick={() => setOpen(false)}>
                Donate
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
