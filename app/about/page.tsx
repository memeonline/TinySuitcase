// About Page - /about route
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import Script from 'next/script'

// Type declaration for custom web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'hotfx-split-flap': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        height?: string;
        width?: string;
        duration?: string;
        characters?: string;
      }, HTMLElement>;
    }
  }
}

export default function About() {
  const menuItems = [
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Work', href: '/work' },
  ]

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const splitFlapContainerRef = useRef<HTMLDivElement | null>(null)
  const splitFlapContainerRefEmpty = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const novels = [
      '      LOS ANGELES',
      '     NEW YORK CITY',
      '      MEXICO CITY',
    ]
    let currentIndex = 3

    const interval = setInterval(() => {
      const element = splitFlapContainerRef.current?.querySelector('hotfx-split-flap') as HTMLElement
      if (element) {
        currentIndex = currentIndex >= novels.length - 1 ? 0 : currentIndex + 1
        element.textContent = novels[currentIndex]
      }
    }, 8000)

    return () => clearInterval(interval)



  }, [])

  
  useEffect(() => {
    const novels = [
      '',
    ]
    let currentIndex = 10

    const interval = setInterval(() => {
      const element = splitFlapContainerRefEmpty.current?.querySelector('hotfx-split-flap') as HTMLElement
      if (element) {
        currentIndex = currentIndex >= novels.length - 1 ? 0 : currentIndex + 1
        element.textContent = novels[currentIndex]
      }
    }, 8000)

    return () => clearInterval(interval)



  }, [])

  return (
    <main>
      {/* Navigation Menu */}
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-menu-items">
            {/* Home Link */}
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

            {/* Centered menu items container - hidden on mobile */}
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
              <Link href={item.href} className="menu-link">
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

              {/* Hamburger Menu Button - visible only on mobile */}
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

          {/* Mobile Menu Overlay */}
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
                    {menuItems.map((item, index) => (
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

      {/* Section 1 - Our Mission */}
      <section className="scroll-snap-section about-section-1">
        <div className="about-section-container">
          <motion.div
            className="about-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="about-section-title">Our Mission</h2>
            <p className="about-section-text">
              We design brand experiences that feel personal, thoughtful, and authentic, whether that&apos;s a social-first campaign, an editorial-style shoot, or an amenity kit waiting inside a guest room, our goal is always the same: to cultivate community and connection that lasts far beyond checkout.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 2 - Placeholder */}
      <section className="scroll-snap-section about-section-2">
        <div className="about-section-container">
          <motion.div
            className="about-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="about-section-title">Section 2</h2>
            <p className="about-section-text">
              Content coming soon...
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 3 - Placeholder */}
      <section className="scroll-snap-section about-section-3">
        <div className="about-section-container">
          <motion.div
            className="about-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="about-section-title">Section 3</h2>
            <p className="about-section-text">
              Content coming soon...
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 4 - Split Flap Display */}
      <section className="scroll-snap-section about-section-4">
        <div className="about-section-container-flip" >
          <motion.div
            className="about-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div id="hot-0bf6g" style={{ marginBottom: '-0.1rem' }} ref={splitFlapContainerRefEmpty}>
              <hotfx-split-flap height="1" width="23" duration="10">
                
              </hotfx-split-flap>
              </div>
            <div id="hot-0bf6e" style={{ marginTop: '0rem' }}>
              <hotfx-split-flap height="2" width="23" duration="100">
              &nbsp;TINY SUITCASE STUDIOS
              </hotfx-split-flap>
              </div>
              <div id="hot-0bf6f" style={{ marginTop: '.1rem' }}>
              <hotfx-split-flap height="2" width="23" duration="100">
              &nbsp;&nbsp;&nbsp;&nbsp;OPERATING&nbsp;&nbsp;FROM
              </hotfx-split-flap>
            </div>
            <div id="hot-novels" style={{ marginTop: '.1rem' }} ref={splitFlapContainerRef}>
              <hotfx-split-flap height="2" width="23" duration="100" >
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MEXICO CITY
              </hotfx-split-flap>
            </div>

          </motion.div>
        </div>
      </section>

      <Script
        src="https://cdn.jsdelivr.net/npm/@hot-page/hotfx-split-flap"
        strategy="afterInteractive"
        type="module"
      />
    </main>
  )
}

