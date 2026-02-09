// Home Page - / route
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const menuItems = [
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Work', href: '/work' },
  ]

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMenuBlack, setIsMenuBlack] = useState(false)

  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return

    const handleScroll = () => {
      const section2 = document.querySelector('.home-section-2')
      const section3 = document.querySelector('.home-section-3')
      if (section2 && section3) {
        const rect2 = section2.getBoundingClientRect()
        const rect3 = section3.getBoundingClientRect()
        const threshold = 150
        const inSection2 = rect2.top <= threshold && rect2.bottom >= threshold
        const inSection3 = rect3.top <= threshold && rect3.bottom >= threshold
        setIsMenuBlack(inSection2 || inSection3)
      }
    }

    main.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => main.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="main-home">
      {/* Navigation Menu */}
      <nav className={`nav ${isMenuBlack ? 'nav-black' : ''}`}>
        <div className="nav-container">
          <div className="nav-menu-items">
            <motion.div
              className="home-link-in-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/" className="menu-link" style={{ fontFamily: "'TG Girthy Ultra', sans-serif", fontWeight: 'bold', fontSize: '1rem', letterSpacing: '0.1em' }}>
                TINY SUITCASE
                <motion.span
                  className="menu-underline"
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>

            <div className="nav-menu-items-centered">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={item.href} className="menu-link menu-link-centered">
                    {item.label}
                    <motion.span
                      className="menu-underline"
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="contact-link-in-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/contact" className="menu-link menu-link-centered">
                Contact
                <motion.span
                  className="menu-underline"
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>

            <button
              className="hamburger-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.div
                className="mobile-menu-content"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="mobile-menu-close"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  ×
                </button>
                <div className="mobile-menu-items">
                  {[...menuItems, { label: 'Contact', href: '/contact' }].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className="mobile-menu-link"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <section className="scroll-snap-section home-section">
        <div className="home-hero">
          <motion.div
            className="home-hero-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="home-hero-tagline">Curated storytelling for boutique hotels and lifestyle brands.</p>
            <p className="home-hero-tagline-sub">We transform experiences into visuals, words, and on-property moments that capture attention and build connection long after checkout.</p>
          </motion.div>
          <motion.div
            className="home-hero-image"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image
              src="/images/door.png"
              alt=""
              width={600}
              height={800}
              className="home-door-image"
              priority
            />
          </motion.div>
        </div>
        <div className="home-hero-bottom-bar" aria-hidden />
      </section>

      <section className="scroll-snap-section home-section-2">
        <div className="home-ticker-wrap">
          <div className="home-ticker-track">
            <span className="home-ticker-item">Creative Leadership · Creative Direction · Content Strategy · On-Site Production · </span>
            <span className="home-ticker-item" aria-hidden>Creative Leadership · Creative Direction · Content Strategy · On-Site Production · </span>
            <span className="home-ticker-item" aria-hidden>Creative Leadership · Creative Direction · Content Strategy · On-Site Production · </span>
          </div>
        </div>
        <br />  <br />
        <div className="home-section-2-inner">
          <motion.p
            className="home-section-2-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            Boutique hotels are where unforgettable
            <br /> experiences begin. We turn them into stunning <br />
             stories that <strong>stay with you.</strong>
          </motion.p>
          <Link href="/services" className="home-section-2-learn-more">
            LEARN MORE
          </Link>
        </div>
      </section>

      <section className="scroll-snap-section home-section-3">
        <div className="home-section-3-split">
          <div className="home-section-3-left">
            <h2 className="home-section-3-title">HOW WE WORK</h2>
            <p className="home-section-3-text">
              <strong>Creative guidance</strong> for every visual and narrative detail.
              <br />
              <strong>Content strategy</strong> aligned with your brand identity.
              <br />
              <strong>Curated experiences</strong> that inspire photos and stories.
            </p>
            <Link href="/services" className="home-section-3-link">
            <br /><br />
              SEE FULL SERVICES
            </Link>
          </div>
          <div className="home-section-3-right">
            <h2 className="home-section-3-title">WHY PARTNER WITH US</h2>
            <p className="home-section-3-text">
              <strong>Clarity & Cohesion</strong> every detail reinforces your brand.
              <br />
              <strong>Story-Led Approach</strong> narratives that resonate with guests.
              <br />
              <strong>Execution Confidence</strong> strategy + oversight handled by experts.
            </p>
            
            <Link href="/contact" className="home-section-3-link">
            <br /><br />
              WORK WITH US
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
