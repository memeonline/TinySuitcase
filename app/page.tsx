// Home Page - / route
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function ComingSoon() {
  const menuItems = [
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Work', href: '/work' },
  ]

  return (
    <main>
      {/* Section 0 - Main Page */}
      <section className="scroll-snap-section flex flex-col" style={{ backgroundColor: 'var(--cream-bg)' }}>
        {/* Navigation Menu */}
        <nav className="nav">
          <div className="nav-container">
            <div className="nav-menu-items">
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
          </div>
        </nav>

        <div className="content-wrapper flex-1">
          <div className="content-container">
            {/* Logo/Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="main-title">
                <span>TINY</span>
                <Image
                  src="/images/HS_Drawing.gif"
                  alt=""
                  width={250}
                  height={250}
                  className="title-gif"
                  unoptimized
                />
                <span>SUITCASE</span>
              </h1>
            </motion.div>

            {/* Coming Soon Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="coming-soon-badge">
                Coming Soon
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 1 */}
      <section className="scroll-snap-section bg-blue-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-blue-900">Section 1</h2>
        </motion.div>
      </section>

      {/* Section 2 */}
      <section className="scroll-snap-section bg-green-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-green-900">Section 2</h2>
        </motion.div>
      </section>

      {/* Section 3 */}
      <section className="scroll-snap-section bg-purple-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-purple-900">Section 3</h2>
        </motion.div>
      </section>

      {/* Section 4 */}
      <section className="scroll-snap-section bg-orange-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-orange-900">Section 4</h2>
        </motion.div>
      </section>
    </main>
  )
}

