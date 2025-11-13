// Services Page - /services route
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Services() {
  const menuItems = [
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Work', href: '/work' },
  ]

  return (
    <main className="main-container">
      {/* Navigation Menu */}
      <nav className="nav">
        <div className="nav-container">
          {/* Home Link */}
          <motion.div
            className="home-link-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="home-link">
              <span>TINY</span>
              <span>SUITCASE</span>
            </Link>
          </motion.div>

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

      <div className="content-wrapper">
        <div className="content-container-simple">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="page-title">Services</h1>
            <p className="body-text">Coming soon...</p>
          </motion.div>
        </div>
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="footer"
      >
        <p className="footer-text">
          © {new Date().getFullYear()} Tiny Suitcase. All rights reserved.
        </p>
      </motion.footer>
    </main>
  )
}

