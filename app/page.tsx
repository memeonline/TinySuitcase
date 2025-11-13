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

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We&apos;re crafting extraordinary travel experiences tailored for influencers and content creators.
          </p>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Personalized journeys that inspire and create unforgettable memories.
          </p>
        </motion.div>

        {/* Travel Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 rounded-2xl overflow-hidden shadow-2xl max-w-3xl mx-auto"
        >
          <div className="relative w-full h-64 md:h-96 bg-gradient-to-br from-indigo-400 to-purple-500">
            <Image
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1635&q=80"
              alt="Travel destination"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          {[
            { icon: '✈️', title: 'Curated Destinations', desc: 'Handpicked locations' },
            { icon: '📸', title: 'Influencer Focused', desc: 'Content-ready experiences' },
            { icon: '🎯', title: 'Personalized Service', desc: 'Tailored to your style' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              className="p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl shadow-lg"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {feature.desc}
              </p>
            </motion.div>
          ))}
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

