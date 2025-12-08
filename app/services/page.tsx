// Services Page - /services route
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Services() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // Track when sections are in view to change menu color
  useEffect(() => {
    const handleScroll = () => {
      const section1 = document.querySelector('.services-section-1')
      const section2 = document.querySelector('.services-section-2')
      const nav = document.querySelector('.nav')
      if (nav) {
        let section2InView = false
        let section1InView = false
        
        if (section1) {
          const rect1 = section1.getBoundingClientRect()
          section1InView = rect1.top <= 100 && rect1.bottom >= 100
        }
        
        if (section2) {
          const rect2 = section2.getBoundingClientRect()
          section2InView = rect2.top <= 100 && rect2.bottom >= 100
        }
        
        // Remove all menu color classes first
        nav.classList.remove('nav-services-section-1', 'nav-services-section-2')
        
        // Add appropriate class - section 2 takes priority if both are in view
        if (section2InView) {
          nav.classList.add('nav-services-section-2')
        } else if (section1InView) {
          nav.classList.add('nav-services-section-1')
        } else {
          // Default to section 1 (beige) if at top of page
          nav.classList.add('nav-services-section-1')
        }
      }
    }

    const main = document.querySelector('main')
    if (main) {
      main.addEventListener('scroll', handleScroll)
      handleScroll() // Check on mount
      return () => main.removeEventListener('scroll', handleScroll)
    }
  }, [])
  const menuItems = [
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Work', href: '/work' },
  ]

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

      {/* Section 1 - Brand Services */}
      <section className="scroll-snap-section services-section-1">
        <div className="services-page-wrapper">
          <div className="services-page-split">
            {/* Left Side - 40% */}
            <div className="services-page-left">
              <h1 className="services-page-title">BRAND <br></br>SERVICES</h1>
            </div>

            {/* Right Side - 60% */}
            <div className="services-page-right">
              <div className="services-content">
                <div className="services-item">
                  <h2 className="services-item-title">FORA TRAVEL LOGISTICS</h2>
                  <p className="services-item-text">
                    Location scouting & booking, access to aesthetic boutique hotels, concierge services, and VIP upgrades (comped breakfasts, spa credits, etc.).
                  </p>
                </div>

                <div className="services-item">
                  <h2 className="services-item-title">CONTENT-DRIVEN ITINERARIES</h2>
                  <p className="services-item-text">
                    Content strategy created before the trip and on-brand storytelling moments built throughout the schedule.
                  </p>
                </div>

                <div className="services-item">
                  <h2 className="services-item-title">CREATIVE DIRECTION</h2>
                  <p className="services-item-text">
                    Moodboards, shot lists, and copy & messaging guides for influencers and brands.
                  </p>
                </div>

                <div className="services-item">
                  <h2 className="services-item-title">CAMPAIGN DEVELOPMENT</h2>
                  <p className="services-item-text">
                    Backed by 12+ years of advertising experience, we help develop full-scale campaigns to fit any brief.
                  </p>
                </div>

                <div className="services-item">
                  <h2 className="services-item-title">ON-SITE SUPPORT</h2>
                  <p className="services-item-text">
                    Content capture, art direction, styling, and video—tailored for brand editorials, evergreen content, or whatever you need.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - For Hotels */}
      <section className="scroll-snap-section services-section-2">
        <div className="services-page-wrapper">
          <div className="services-page-split">
            {/* Left Side - 60% */}
            <div className="services-page-right">
              <div className="services-content">
                <div className="services-item">
                  <h2 className="services-item-title">CONTENT DEVELOPMENT</h2>
                  <p className="services-item-text">
                  Capture your guest experience and turn it into a curated content library and storytelling strategy that drives bookings.</p>
                </div>

                <div className="services-item">
                  <h2 className="services-item-title">INFLUENCER MARKETING</h2>
                  <p className="services-item-text">
                  As early adopters in the space, we curate talent, build clear creative direction, and manage partnerships to deliver high-impact content.</p>
                </div>

                <div className="services-item">
                  <h2 className="services-item-title">BRAND AMBASSADORS</h2>
                  <p className="services-item-text">
                  We match you with vetted creators who embody your brand, amplifying your message and delivering ongoing UGC year-round.</p>
                </div>

                <div className="services-item">
                  <h2 className="services-item-title">BRAND CONCIERGE (coming soon)</h2>
                  <p className="services-item-text">
                  Launching in 2026, we curate and style partner brands inside hotels—creating new revenue streams and photo-ready guest experiences.</p>
                </div>
              </div>
            </div>

            {/* Right Side - 30% */}
            <div className="services-page-left">
              <h1 className="services-page-title">HOTELS<br></br>SERVICES</h1>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

