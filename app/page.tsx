'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function ComingSoon() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Tiny Suitcase
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-light">
            Boutique Travel Agency
          </p>
        </motion.div>

        {/* Coming Soon Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-full text-sm md:text-base font-semibold shadow-lg">
            Coming Soon
          </div>
        </motion.div>


        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Tiny Suitcase. All rights reserved.
          </p>
        </motion.div>
      </div>
    </main>
  )
}

