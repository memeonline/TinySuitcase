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
    <main className="main-container">
      {/* Navigation Menu */}
      <nav className="nav">
        <div className="nav-container">
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
      </nav>

      <div className="content-wrapper">
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

      {/* Footer */}
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

