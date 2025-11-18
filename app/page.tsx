// Home Page - / route
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void
    }
  }
}

// Image files from section1 folder (excluding MOV files)
const section1Images = [
  'IMG_0069.jpeg',
  'IMG_0098.JPG',
  'IMG_1191.jpeg',
  'IMG_1724.jpeg',
  'IMG_2011.jpeg',
  'IMG_2015.jpeg',
  'IMG_2046.jpeg',
  'IMG_2048.jpeg',
  'IMG_2050.jpeg',
  'IMG_2052.jpeg',
  'IMG_2381.jpeg',
  'IMG_2446.jpeg',
  'IMG_2461.jpeg',
  'IMG_3778.jpg',
  'IMG_4839.jpeg',
  'IMG_5169.jpeg',
  'IMG_5256.jpg',
  'IMG_5575.jpeg',
  'IMG_6106.jpg',
  'IMG_7496.jpeg',
  'IMG_7771.jpg',
  'IMG_7798.jpeg',
  'IMG_8499.jpeg',
  'IMG_8760.jpeg',
  'IMG_9044.jpeg',
  'IMG_9302.jpeg',
  'IMG_9321.jpeg',
  'IMG_9326.jpeg',
  'IMG_9702.jpeg',
  'IMG_9719.jpeg',
  'IMG_9751.jpeg',
  'IMG_9933.jpeg',
]

const cyclingTexts = [
  'INFLUENCER MARKETING',
  'TRAVEL CONCIERGE',
  'CONTENT STUDIO'
]

function AnimatedSection1() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [previousTextIndex, setPreviousTextIndex] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [activeImages, setActiveImages] = useState<string[]>([])
  const [imageIndex, setImageIndex] = useState(0) // Track position in shuffled array
  const [shuffledImages, setShuffledImages] = useState<string[]>([])
  const [allImagesShown, setAllImagesShown] = useState(false) // Track if all images have been shown

  // Initialize: shuffle all images and start showing them
  useEffect(() => {
    const shuffled = [...section1Images].sort(() => Math.random() - 0.5)
    setShuffledImages(shuffled)
    setAllImagesShown(false)
    // Show 5-8 images at a time
    const numImages = Math.min(5 + Math.floor(Math.random() * 4), shuffled.length)
    setActiveImages(shuffled.slice(0, numImages))
    setImageIndex(numImages)
  }, [])

  // Periodically add new images from the shuffled array
  useEffect(() => {
    if (shuffledImages.length === 0) return

    const interval = setInterval(() => {
      // If we've shown all images, stop adding new ones
      if (imageIndex >= shuffledImages.length) {
        setAllImagesShown(true)
        return
      }

      setActiveImages((current) => {
        // Remove 1-2 old images
        const toRemove = 1 + Math.floor(Math.random() * 2)
        const updated = current.slice(toRemove)
        
        // Add new images from shuffled array (only if we haven't shown all yet)
        const remaining = shuffledImages.length - imageIndex
        if (remaining > 0) {
          const toAdd = Math.min(toRemove, remaining)
          const newImages = shuffledImages.slice(imageIndex, imageIndex + toAdd)
          const newIndex = imageIndex + toAdd
          
          // Check if we've now shown all images
          if (newIndex >= shuffledImages.length) {
            setAllImagesShown(true)
          }
          
          setImageIndex(newIndex)
          return [...updated, ...newImages]
        }
        
        return updated
      })
    }, 15000 + Math.random() * 10000) // Every 15-25 seconds

    return () => clearInterval(interval)
  }, [shuffledImages, imageIndex])

  // When all images are shown, wait a bit then reshuffle and start over
  useEffect(() => {
    if (!allImagesShown || shuffledImages.length === 0) return

    const timeout = setTimeout(() => {
      const shuffled = [...section1Images].sort(() => Math.random() - 0.5)
      setShuffledImages(shuffled)
      setAllImagesShown(false)
      const numImages = Math.min(5 + Math.floor(Math.random() * 4), shuffled.length)
      setActiveImages(shuffled.slice(0, numImages))
      setImageIndex(numImages)
    }, 30000) // Wait 30 seconds after all shown before restarting

    return () => clearTimeout(timeout)
  }, [allImagesShown, shuffledImages.length])

  // Generate simple random properties for each image
  const imageProps = useMemo(() => {
    if (activeImages.length === 0) return []
    
    return activeImages.map((_, index) => {
      // Simple random width
      const width = 5 + Math.random() * 10 // 5-15% viewport width
      
      // Simple random speed
      const speed = 0.15 + Math.random() * 0.2 // 0.15 to 0.35
      
      // Random z-index
      const zIndex = Math.random() > 0.5 ? 11 : 4
      
      // Random vertical position (avoid nav area)
      const topPosition = 25 + Math.random() * 60 // 25% to 85%
      
      // Random delay - space them out
      const delay = index * 2 + Math.random() * 3 // Stagger by 2s + random
      
      // Random height
      const height = 40 + Math.random() * 40 // 40-80vh
      
      return {
        width,
        speed,
        zIndex,
        delay,
        topPosition,
        height,
      }
    })
  }, [activeImages])

  // Cycle through texts every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPreviousTextIndex(currentTextIndex)
      setIsTransitioning(true)
      // Calculate fade-out time: (letters.length - 1) * 0.05 (delay) + 0.4 (duration)
      const currentTextLength = cyclingTexts[currentTextIndex].length
      const fadeOutTime = (currentTextLength - 1) * 0.05 + 0.4
      
      // Wait for old text to fade out, then show new text
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % cyclingTexts.length)
        setIsTransitioning(false)
        // Clear previous text after a short delay
        setTimeout(() => {
          setPreviousTextIndex(null)
        }, 100)
      }, fadeOutTime * 1000)
    }, 5000)
    return () => clearInterval(interval)
  }, [currentTextIndex])

  return (
    <section className="scroll-snap-section section-1-animated">
      {/* Static Title */}
      <h2 className="section-1-title">A NEW TYPE OF CREATIVE PARTNER</h2>

      {/* Scrolling Images Container */}
      <div className="scrolling-images-container">
        {activeImages.length > 0 && activeImages.map((image, index) => {
          const props = imageProps[index]
          if (!props) return null
          return (
            <div
              key={`${image}-${index}`}
              className="scrolling-image-wrapper"
              style={{
                '--image-width': `${props.width}vw`,
                '--image-height': `${props.height}vh`,
                '--scroll-speed': `${props.speed * 100}s`,
                '--start-delay': `-${props.delay}s`,
                '--top-position': `${props.topPosition}%`,
                zIndex: props.zIndex,
              } as React.CSSProperties}
            >
              <Image
                src={`/images/section1/${image}`}
                alt=""
                width={800}
                height={600}
                className="scrolling-image"
                unoptimized
              />
            </div>
          )
        })}
        {/* Duplicate set for seamless loop - only show after all images have been displayed */}
        {allImagesShown && activeImages.length > 0 && activeImages.map((image, index) => {
          const props = imageProps[index]
          if (!props) return null
          const animationDuration = props.speed * 100
          // Simple duplicate delay: start after original finishes
          const duplicateDelay = props.delay + animationDuration + 3 // 3s buffer between repetitions
          return (
            <div
              key={`${image}-${index}-dup`}
              className="scrolling-image-wrapper"
              style={{
                '--image-width': `${props.width}vw`,
                '--image-height': `${props.height}vh`,
                '--scroll-speed': `${animationDuration}s`,
                '--start-delay': `-${duplicateDelay}s`,
                '--top-position': `${props.topPosition}%`,
                zIndex: props.zIndex,
              } as React.CSSProperties}
            >
              <Image
                src={`/images/section1/${image}`}
                alt=""
                width={800}
                height={600}
                className="scrolling-image"
                unoptimized
              />
            </div>
          )
        })}
      </div>

      {/* Cycling Text in Center */}
      <div className="cycling-text-container">
        {cyclingTexts.map((text, index) => {
          const isActive = index === currentTextIndex && !isTransitioning
          const isPrevious = previousTextIndex !== null && index === previousTextIndex
          const letters = text.split('')
          
          // Only render if it's the active text or the previous text that's fading out
          if (!isActive && !isPrevious) return null
          
          return (
            <motion.div
              key={text}
              className="cycling-text"
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                zIndex: 9, // Between images (4, 11) and title (7)
                display: 'flex',
                whiteSpace: 'nowrap',
              }}
            >
              {letters.map((letter, letterIndex) => (
                <motion.span
                  key={`${text}-${letterIndex}`}
                  className="cycling-text-letter"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: isActive 
                      ? (letters.length - letterIndex - 1) * 0.05 // Fade in from right to left
                      : (letters.length - letterIndex - 1) * 0.05, // Fade out from right to left
                    ease: 'easeInOut',
                  }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

export default function ComingSoon() {
  const menuItems = [
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Work', href: '/work' },
  ]

  return (
    <main>
      {/* Section 0 - Main Page */}
      <section className="scroll-snap-section home-section">
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

        <div className="content-wrapper content-wrapper-layout">
          <div className="content-container">
            {/* Logo/Title */}
            <motion.div
              className="title-container"
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

            {/* Subtitle */}
            <motion.div
              className="subtitle-container"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="subtitle-text">content studio & brand concierge</p>
            </motion.div>
          </div>

          {/* Book Consultation Button */}
          <motion.div
            className="button-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button 
              className="consultation-button"
              onClick={(e) => {
                e.preventDefault()
                if (typeof window !== 'undefined') {
                  if (window.Calendly) {
                    window.Calendly.initPopupWidget({
                      url: 'https://calendly.com/tinysuitcasestudios/30min'
                    })
                  } else {
                    // Wait for Calendly to load
                    const checkCalendly = setInterval(() => {
                      if (window.Calendly) {
                        window.Calendly.initPopupWidget({
                          url: 'https://calendly.com/tinysuitcasestudios/30min'
                        })
                        clearInterval(checkCalendly)
                      }
                    }, 100)
                    // Stop checking after 5 seconds
                    setTimeout(() => clearInterval(checkCalendly), 5000)
                  }
                }
                return false
              }}
            >
              BOOK A CONSULTATION
            </button>
          </motion.div>
        </div>
      </section>

      {/* Section 1 - Animated Image Scroll */}
      <AnimatedSection1 />

      {/* Section 2 */}
      <section className="scroll-snap-section section-green section-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title section-title-green">Section 2</h2>
        </motion.div>
      </section>

      {/* Section 3 */}
      <section className="scroll-snap-section section-purple section-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title section-title-purple">Section 3</h2>
        </motion.div>
      </section>

      {/* Section 4 */}
      <section className="scroll-snap-section section-orange section-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title section-title-orange">Section 4</h2>
        </motion.div>
      </section>
    </main>
  )
}


