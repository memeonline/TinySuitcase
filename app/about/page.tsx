// About Page - /about route
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
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

      {/* Section 2 - Megan Dreisbach */}
      <section className="scroll-snap-section about-section-2">
        <div className="about-section-2-container">
          <motion.div
            className="about-section-2-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            {/* Image on the left */}
            <div className="about-section-2-image-wrapper" style={{ maxWidth: '400px', marginTop: '-1rem' }}>
              <Image
                src="/images/about/megan.png"
                alt="Megan Dreisbach"
                width={400}
                height={480}
                className="about-section-2-image"
                unoptimized
                
              />
            </div>

            {/* Text on the right */}
            <div className="about-section-2-text-wrapper" style={{ marginTop: '1rem' }}>
              <h2 className="about-section-2-title">Megan Dreisbach</h2>
              <p className="about-section-2-bio">
                Megan Dreisbach is a creative director, art director, and designer whose work blends strategic clarity with visual storytelling. Split between New York and Mexico City, she approaches each project with design-minded curiosity, exploring culture and place to shape narratives that resonate.
                <br />
                With experience spanning global beauty/lifestyle brands and boutique travel experiences, she believes powerful visuals come from meticulous detail. They build connection. They shape memory. And they reveal beauty in places we don&apos;t always think to look—like a ginger finding her fairytale in CDMX.
              </p>
            </div>
          </motion.div>
          
          {/* Bottom images section */}
          <motion.div
            className="about-section-2-bottom-images"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="about-section-2-bottom-content">
              <div className="about-section-2-personality-text">
                <h3 className="about-section-2-personality-title">Personality Snapshot...</h3>
              </div>
              <div className="about-section-2-image-grid">
                <div className="about-section-2-image-item">
                  <Image
                    src="/images/about/jacarandas.png"
                    alt="Jacarandas"
                    width={150}
                    height={195}
                    className="about-section-2-bottom-image"
                    unoptimized
                  />
                  <p className="about-section-2-image-caption">
                    The best time of the year:
                    <span className="about-section-2-image-caption-bold">Jacaranda season in Mexico City</span>
                  </p>
                </div>
                <div className="about-section-2-image-item">
                  <p className="about-section-2-image-caption-top">
                    A recent rediscovery as an adult:
                    <span className="about-section-2-image-caption-text">Mangos, because location changes everything</span>
                  </p>
                  <Image
                    src="/images/about/mango.png"
                    alt="Mango"
                    width={100}
                    height={130}
                    className="about-section-2-bottom-image"
                    unoptimized
                  />
                </div>
                <div className="about-section-2-image-item about-section-2-image-item-right">
                  <Image
                    src="/images/about/quetzal.png"
                    alt="Quetzal"
                    width={150}
                    height={195}
                    className="about-section-2-bottom-image"
                    unoptimized
                  />
                  <p className="about-section-2-image-caption-right">
                    I&apos;m a BIG FAN of:
                    <span className="about-section-2-image-caption-text">Fluid shapes and high-contrast palettes</span>
                  </p>
                </div>
                <div className="about-section-2-image-item about-section-2-image-item-bottom">
                  <p className="about-section-2-image-caption about-section-2-image-caption-left">
                    First stop in a new city:
                    <span className="about-section-2-image-caption-bold">I start in the galleries.</span>
                  </p>
                  <Image
                    src="/images/about/galeries.png"
                    alt="Galleries"
                    width={150}
                    height={195}
                    className="about-section-2-bottom-image"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 3 - Danielle Robles */}
      <section className="scroll-snap-section about-section-3">
        <div className="about-section-2-container">
          <motion.div
            className="about-section-2-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            {/* Image on the left */}
            <div className="about-section-2-image-wrapper" style={{ maxWidth: '550px' }}>
              <Image
                src="/images/about/Danielle.png"
                alt="Danielle Robles"
                width={600}
                height={680}
                className="about-section-2-image"
                unoptimized
              />
            </div>

            {/* Text on the right */}
            <div className="about-section-2-text-wrapper" style={{ marginTop: '-.5rem' }}>
              <h2 className="about-section-2-title">Danielle Robles</h2>
              <p className="about-section-2-bio">
                Danielle Robles is an LA-native creative director, copywriter, and content strategist with over 13 years of experience shaping narratives for some of the world&apos;s most recognizable brands. Coming from a multicultural background, she approaches every story with curiosity––about culture, identity, and the ways creativity shapes how we see the world.
                <br />
                From developing glossy eBay campaigns to capturing boots-on-the-ground content for New York Fashion Week, she believes that the stories worth telling are the ones that bleed authenticity. They linger in our minds long after we scroll away. They remind us we&apos;re human.
              </p>
            </div>
          </motion.div>

          {/* Bottom images section */}
          <motion.div
            className="about-section-2-bottom-images"
            style={{ marginTop: '-10rem' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="about-section-2-bottom-content">
              <div className="about-section-2-personality-text">
                <h3 className="about-section-2-personality-title" style={{ marginTop: '7rem' }}>A few of my favorite things...</h3>
              </div>
            </div>
            <div className="about-section-2-image-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: '900px', margin: '0 auto', marginLeft: '25rem' }}>
              <div className="about-section-2-image-item" style={{ position: 'relative' }}>
              <p className="about-section-2-image-caption about-section-2-image-caption-left" style={{ marginTop: '-7rem', marginBottom: '-3rem', position: 'relative', zIndex: 1 }}>
                Favorite thing about L.A.:<span className="about-section-2-image-caption-bold" >Eating a breakfast burrito on <br />the beach in mid-November</span>
                </p>
                <Image
                  src="/images/about/burrito.png"
                  alt="Burrito"
                  width={150}
                  height={195}
                  className="about-section-2-bottom-image"
                  style={{ marginTop: '-1rem' }}
                  unoptimized
                />
              </div>
              <div className="about-section-2-image-item" style={{ marginTop: '-12rem' }}>
                <Image
                  src="/images/about/city.png"
                  alt="City"
                  width={150}
                  height={195}
                  className="about-section-2-bottom-image"
                  unoptimized
                />
                <p className="about-section-2-image-caption" style={{ marginLeft: '-3rem', marginTop: '-.2rem' }}>
                  Favorite cities: <span className="about-section-2-image-caption-bold">CDMX, Lisbon & <br /> Copenhagen</span>
                </p>
              </div>
              <div className="about-section-2-image-item" style={{ marginTop: '-9rem', position: 'relative' }}>
                <p className="about-section-2-image-caption about-section-2-image-caption-left" style={{ marginTop: '-2rem', marginBottom: '-3rem', marginLeft: '2rem', position: 'relative', zIndex: 1 }}>
                  Favourite quote:
                </p>
                <Image
                  src="/images/about/postit.png"
                  alt="Postit"
                  width={225}
                  height={293}
                  className="about-section-2-bottom-image about-section-2-bottom-image-large"
                  unoptimized
                />
              </div>
            </div>
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
            <div id="hot-0bf6g" style={{ marginBottom: '0.1rem' }} ref={splitFlapContainerRefEmpty}>
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
            </div>Update the desi

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

