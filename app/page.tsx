// Home Page - / route
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void
    }
  }
}

// Images will be loaded dynamically from the folder

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
  const [section1Images, setSection1Images] = useState<string[]>([]) // Images loaded from folder
  const [imagesLoaded, setImagesLoaded] = useState(false) // Track if images have been loaded
  // Store properties for each image by filename and cycle - updates each appearance
  const [imageProperties, setImageProperties] = useState<Map<string, {
    width: number
    speed: number
    zIndex: number
    delay: number
    topPosition: number
    height: number
    cycle: number // Track appearance cycle
  }>>(new Map())
  // Track how many times each image has appeared
  const [imageCycleCount, setImageCycleCount] = useState<Map<string, number>>(new Map())
  // Track when component mounted (page load time) for delay calculations
  const mountTimeRef = useRef<number>(Date.now())

  // Load images from folder on mount - only once
  useEffect(() => {
    if (imagesLoaded) return // Only load once

    const loadImages = async () => {
      try {
        const response = await fetch('/api/images')
        if (response.ok) {
          const data = await response.json()
          setSection1Images(data.images || [])
          setImagesLoaded(true)
        } else {
          console.error('Failed to load images')
          setImagesLoaded(true) // Set to true to prevent retries
        }
      } catch (error) {
        console.error('Error loading images:', error)
        setImagesLoaded(true) // Set to true to prevent retries
      }
    }

    loadImages()
  }, [imagesLoaded])

  // Helper function to generate random properties for an image
  // cycle: appearance number (1, 2, 3, etc.) - different cycle = different random properties
  const generateImageProperties = (imageName: string, cycle: number) => {
    // Use image name + cycle with large prime multipliers to ensure completely different properties each appearance
    // Cycle increments ensure each appearance has different random properties (no patterns)
    const imageHash = imageName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    // Use large primes to ensure good distribution and no patterns
    const seed = imageHash + (cycle * 7919) + (cycle * cycle * 9973)
    const rng = (offset: number) => {
      const x = Math.sin((seed + offset) * 12.9898) * 43758.5453
      return x - Math.floor(x)
    }
    
    return {
      width: 5 + rng(1) * 10, // 5-15% viewport width
      speed: 0.1 + rng(2) * 0.2, // 0.1 to 0.3
      zIndex: rng(3) > 0.5 ? 11 : 4,
      topPosition: 15 + rng(4) * 70, // 15% to 85%
      height: 40 + rng(5) * 40, // 40-80vh
      cycle: cycle, // Track which appearance cycle this is
    }
  }
  

  // Helper to calculate minimum delay needed to prevent overlap
  // Returns the time when the previous image has cleared the entry point (right edge)
  const calculateMinDelay = (
    prevProps: { delay: number; width: number; speed: number; topPosition?: number } | null,
    newDelay: number
  ): number => {
    if (!prevProps) return newDelay
    
    // Previous image starts at delay = prevProps.delay
    // It needs to travel: image width + some buffer to clear entry point
    // Time needed = (width + buffer) / speed
    const buffer = 3 // 3vw buffer to prevent overlap (reduced to allow more images)
    const clearTime = (prevProps.width + buffer) / prevProps.speed
    const prevImageClearsAt = prevProps.delay + clearTime
    
    // New image should start after previous clears, or at newDelay, whichever is later
    return Math.max(prevImageClearsAt, newDelay)
  }

  // Initialize: shuffle all images and start showing them (when images are loaded)
  useEffect(() => {
    if (!imagesLoaded || section1Images.length === 0) return

    // Fully random shuffle
    const shuffled = [...section1Images].sort(() => Math.random() - 0.5)
    setShuffledImages(shuffled)
    setAllImagesShown(false)
    
    // Show 12-18 images at a time (random count) for more visual density
    const numImages = Math.min(12 + Math.floor(Math.random() * 7), shuffled.length)
    
    // Select random images from shuffled array (not just first ones)
    const selectedIndices = new Set<number>()
    while (selectedIndices.size < numImages) {
      selectedIndices.add(Math.floor(Math.random() * shuffled.length))
    }
    const initialImages = Array.from(selectedIndices).map(idx => shuffled[idx])
    
    setActiveImages(initialImages)
    setImageIndex(numImages)
    
    // Generate properties for initial images - random properties, quick sequential starts
    const newProps = new Map<string, any>()
    const newCycleCount = new Map<string, number>()
    
    // Start many images almost simultaneously to get lots on screen quickly
    let cumulativeDelay = 0
    initialImages.forEach((image, index) => {
      // Get current cycle count and increment for this appearance
      const currentCycle = (imageCycleCount.get(image) || 0) + 1
      newCycleCount.set(image, currentCycle)
      
      const baseProps = generateImageProperties(image, currentCycle)
      
      // Stagger images very quickly: first 6-8 images start almost simultaneously (0-0.2s apart),
      // then continue with 0.1-0.3s spacing for more images on screen
      if (index > 0) {
        let delayIncrement: number
        if (index < 8) {
          delayIncrement = 0.05 + Math.random() * 0.15 // 0.05-0.2s between first 8 images (very quick)
        } else {
          delayIncrement = 0.1 + Math.random() * 0.2 // 0.1-0.3s for rest (still quick)
        }
        cumulativeDelay += delayIncrement
      }
      
      const props: { delay: number; width: number; speed: number; topPosition: number } = {
        ...baseProps,
        delay: cumulativeDelay, // All delays relative to page load (0s for first image)
      }
      
      newProps.set(image, props)
    })
    setImageCycleCount((prev) => {
      const updated = new Map(prev)
      newCycleCount.forEach((count, image) => updated.set(image, count))
      return updated
    })
    setImageProperties(newProps)
    
    // Mark as all shown immediately - no duplicates needed
    setAllImagesShown(true)
  }, [imagesLoaded, section1Images])

  // Replace finished images with new ones to maintain 12-18 active images
  // Track when each image was added to calculate finish time correctly
  const imageAddTimeRef = useRef<Map<string, number>>(new Map())
  
  useEffect(() => {
    if (!allImagesShown || activeImages.length === 0 || shuffledImages.length === 0) return

    const timeouts: NodeJS.Timeout[] = []
    const currentTimeMs = Date.now()

    activeImages.forEach((image) => {
      const props = imageProperties.get(image)
      if (!props) return

      // Check if this image was just added (replacement) or is an initial image
      const addTime = imageAddTimeRef.current.get(image)
      const animationDurationSeconds = props.speed * 100
      
      let timeUntilFinishMs: number
      
      if (addTime) {
        // Replacement image: delay is relative to when element was added
        const timeSinceAddMs = currentTimeMs - addTime
        const timeSinceAddSeconds = timeSinceAddMs / 1000
        const finishTimeSeconds = props.delay + animationDurationSeconds
        timeUntilFinishMs = Math.max((finishTimeSeconds - timeSinceAddSeconds) * 1000, 0)
      } else {
        // Initial image: delay is relative to page load
        const timeSinceMountMs = currentTimeMs - mountTimeRef.current
        const timeSinceMountSeconds = timeSinceMountMs / 1000
        const finishTimeSeconds = props.delay + animationDurationSeconds
        timeUntilFinishMs = Math.max((finishTimeSeconds - timeSinceMountSeconds) * 1000, 0)
      }
      
      if (timeUntilFinishMs <= 0) return

      const timeout = setTimeout(() => {
        // Remove finished image and add new one in single update
        setActiveImages((prev) => {
          const remainingImages = prev.filter((img) => img !== image)
          imageAddTimeRef.current.delete(image)
          
          // Pick a random image from the pool that's not currently active
          const availableImages = shuffledImages.filter(img => !remainingImages.includes(img))
          let newImage: string
          
          if (availableImages.length === 0) {
            // If all images are active, pick a random one from the pool anyway
            newImage = shuffledImages[Math.floor(Math.random() * shuffledImages.length)]
          } else {
            newImage = availableImages[Math.floor(Math.random() * availableImages.length)]
          }
          
          // Track when this new image is added
          imageAddTimeRef.current.set(newImage, Date.now())
          
          // Generate new properties for this image
          setImageCycleCount((prevCycle) => {
            const currentCycle = prevCycle.get(newImage) || 0
            const newCycle = currentCycle + 1
            const updated = new Map(prevCycle)
            updated.set(newImage, newCycle)
            
            // Calculate delay for new image - use very small delay (0.05-0.2 seconds) relative to when element is created
            // This allows many images to appear quickly on screen simultaneously
            const delayBetween = 0.05 + Math.random() * 0.15 // 0.05-0.2 seconds (very quick)
            const newDelay = delayBetween
            
            const newProps = generateImageProperties(newImage, newCycle)
            
            // Store properties with delay relative to when element is added (0.05-0.2 seconds)
            setImageProperties((prevProps) => {
              const updated = new Map(prevProps)
              updated.set(newImage, {
                ...newProps,
                delay: newDelay, // This is relative to when the element is added to DOM
              })
              return updated
            })
            
            return updated
          })
          
          return [...remainingImages, newImage]
        })
      }, timeUntilFinishMs)

      timeouts.push(timeout)
    })

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [activeImages, allImagesShown, shuffledImages, imageProperties])


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
          const props = imageProperties.get(image)
          if (!props) return null
          return (
            <div
              key={image}
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


