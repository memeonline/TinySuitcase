// Home Page - / route
'use client'

import { motion, AnimatePresence } from 'framer-motion'
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
          console.log('Loaded images from API:', data.images?.length || 0, 'images')
          setSection1Images(data.images || [])
          setImagesLoaded(true)
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.error('Failed to load images:', response.status, errorData)
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
    const buffer = 5 // 5vw buffer to prevent overlap (increased for production stability)
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
    
    // Show 18-22 images at a time to ensure many images are always visible
    const numImages = Math.min(18 + Math.floor(Math.random() * 5), shuffled.length)
    
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
    
    // Start images with smart spacing to prevent overlap based on vertical position
    const previousProps: Array<{ delay: number; width: number; speed: number; topPosition: number }> = []
    
    initialImages.forEach((image, index) => {
      // Get current cycle count and increment for this appearance
      const currentCycle = (imageCycleCount.get(image) || 0) + 1
      newCycleCount.set(image, currentCycle)
      
      const baseProps = generateImageProperties(image, currentCycle)
      
      // Calculate base delay increment - start images very quickly to get many on screen
      let delayIncrement: number
      if (index < 8) {
        delayIncrement = 0.05 + Math.random() * 0.15 // 0.05-0.2s between first 8 images (very fast)
      } else {
        delayIncrement = 0.1 + Math.random() * 0.2 // 0.1-0.3s for rest (still fast)
      }
      
      const lastDelay = previousProps.length > 0 
        ? previousProps[previousProps.length - 1].delay 
        : 0
      const baseDelay = lastDelay + delayIncrement
      
      // Only prevent overlap if images are within 15% vertical distance (tighter threshold = more images can appear)
      // This allows more images on screen simultaneously
      let calculatedDelay = baseDelay
      const similarVerticalProps = previousProps.filter(props => 
        Math.abs(baseProps.topPosition - props.topPosition) < 15
      )
      
      if (similarVerticalProps.length > 0) {
        // Find the latest finish time among similar vertical position images
        const latestFinishTime = similarVerticalProps.reduce((max, props) => {
          const finishTime = props.delay + ((props.width + 3) / props.speed) // width + smaller buffer / speed
          return Math.max(max, finishTime)
        }, 0)
        
        // New image should start after the latest finish, or at baseDelay, whichever is later
        // Minimal buffer - prioritize getting images on screen
        calculatedDelay = Math.max(baseDelay, latestFinishTime + 0.05) // Very small buffer - 0.05s
      }
      
      const props: { delay: number; width: number; speed: number; topPosition: number } = {
        ...baseProps,
        delay: calculatedDelay,
      }
      
      newProps.set(image, props)
      previousProps.push(props)
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

  // Replace finished images with new ones to maintain at least 18 active images (ensures many visible)
  // Track when each image was added and which images have timeouts set up
  const imageAddTimeRef = useRef<Map<string, number>>(new Map())
  const timeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map())
  
  // Minimum number of active images to ensure many are visible at any time
  const MIN_ACTIVE_IMAGES = 18
  
  // Helper function to add a new image
  const addNewImage = (existingImages: string[]): string | null => {
    if (shuffledImages.length === 0) return null
    
    const availableImages = shuffledImages.filter(img => !existingImages.includes(img))
    let newImage: string
    if (availableImages.length === 0) {
      newImage = shuffledImages[Math.floor(Math.random() * shuffledImages.length)]
    } else {
      newImage = availableImages[Math.floor(Math.random() * availableImages.length)]
    }
    
    const currentTime = Date.now()
    imageAddTimeRef.current.set(newImage, currentTime)
    
    // Generate properties for new image - read current cycle count
    setImageCycleCount((prevCycle) => {
      const currentCycle = prevCycle.get(newImage) || 0
      const newCycle = currentCycle + 1
      const updated = new Map(prevCycle)
      updated.set(newImage, newCycle)
      
      const newProps = generateImageProperties(newImage, newCycle)
      
      // Calculate delay - very quick start for replacement images
      const delayBetween = 0.05 + Math.random() * 0.15 // 0.05-0.2s - very fast
      
      // Set properties BEFORE adding to activeImages
      setImageProperties((prevProps) => {
        const updated = new Map(prevProps)
        updated.set(newImage, {
          ...newProps,
          delay: delayBetween,
        })
        return updated
      })
      
      return updated
    })
    
    return newImage
  }
  
  // Helper function to replace an image
  const replaceImage = (finishedImage: string) => {
    if (shuffledImages.length === 0) return
    
    // Clean up old image
    const oldTimeout = timeoutRef.current.get(finishedImage)
    if (oldTimeout) {
      clearTimeout(oldTimeout)
      timeoutRef.current.delete(finishedImage)
    }
    imageAddTimeRef.current.delete(finishedImage)
    
    // Get current active images using setState callback
    setActiveImages((prevActiveImages) => {
      const remainingImages = prevActiveImages.filter((img) => img !== finishedImage)
      const newImage = addNewImage(remainingImages)
      
      // Return updated list - properties are set in state, will be available when useEffect runs
      if (newImage && !remainingImages.includes(newImage)) {
        return [...remainingImages, newImage]
      }
      return remainingImages
    })
  }
  
  // Helper function to ensure minimum active images count
  const ensureMinimumImages = () => {
    if (shuffledImages.length === 0) return
    
    setActiveImages((prevActiveImages) => {
      if (prevActiveImages.length >= MIN_ACTIVE_IMAGES) {
        return prevActiveImages
      }
      
      const imagesToAdd = MIN_ACTIVE_IMAGES - prevActiveImages.length
      const newImages: string[] = []
      
      for (let i = 0; i < imagesToAdd; i++) {
        const newImage = addNewImage([...prevActiveImages, ...newImages])
        if (newImage) {
          newImages.push(newImage)
        }
      }
      
      return [...prevActiveImages, ...newImages]
    })
  }
  
  useEffect(() => {
    if (!allImagesShown || shuffledImages.length === 0) return
    
    // Ensure minimum number of active images (at least 18 to guarantee many visible)
    if (activeImages.length < MIN_ACTIVE_IMAGES) {
      ensureMinimumImages()
      return // Will re-run when activeImages updates
    }

    const currentTimeMs = Date.now()

    activeImages.forEach((image) => {
      // Skip if timeout already exists for this image
      if (timeoutRef.current.has(image)) return
      
      const props = imageProperties.get(image)
      if (!props) {
        // Properties not ready yet, wait a bit and retry more frequently
        const retryTimeout = setTimeout(() => {
          timeoutRef.current.delete(image)
        }, 50) // Faster retry
        timeoutRef.current.set(image, retryTimeout)
        return
      }

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
      
      // If image already finished or will finish very soon, replace it immediately
      if (timeUntilFinishMs <= 50) {
        replaceImage(image)
        return
      }

      // Set up timeout to replace when image finishes
      const timeout = setTimeout(() => {
        timeoutRef.current.delete(image)
        replaceImage(image)
      }, timeUntilFinishMs)

      timeoutRef.current.set(image, timeout)
    })

    return () => {
      // Cleanup is handled by timeoutRef in replaceImage function
    }
  }, [activeImages, allImagesShown, shuffledImages, imageProperties, imageCycleCount])


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
              {letters.map((letter, letterIndex) => {
                const isVAfterA = letter === 'V' && letterIndex > 0 && letters[letterIndex - 1] === 'A'
                return (
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
                    style={isVAfterA ? { marginLeft: '-0.15em' } : undefined}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                )
              })}
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

  const [showHomeLink, setShowHomeLink] = useState(false)
  const [showCalendlyOverlay, setShowCalendlyOverlay] = useState(false)

  // Track scroll position to show/hide home link
  useEffect(() => {
    const handleScroll = () => {
      const main = document.querySelector('main')
      if (main) {
        const scrollTop = main.scrollTop
        // Show home link when scrolled down more than 100px
        setShowHomeLink(scrollTop > 100)
      }
    }

    const main = document.querySelector('main')
    if (main) {
      main.addEventListener('scroll', handleScroll)
      return () => main.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Track when section 3 is in view to change menu color to white
  useEffect(() => {
    const handleScroll = () => {
      const section3 = document.querySelector('.section-3-split')
      const nav = document.querySelector('.nav')
      if (section3 && nav) {
        const rect = section3.getBoundingClientRect()
        const isInView = rect.top <= 100 && rect.bottom >= 100
        if (isInView) {
          nav.classList.add('nav-white')
        } else {
          nav.classList.remove('nav-white')
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

  // Function to scroll to top
  const scrollToTop = () => {
    const main = document.querySelector('main')
    if (main) {
      main.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <main>
      {/* Section 0 - Main Page */}
      <section className="scroll-snap-section home-section">
        {/* Navigation Menu */}
        <nav className="nav">
          <div className="nav-container">
            <div className="nav-menu-items">
              {/* Home Link - only visible when scrolled on main page, positioned absolutely */}
              <AnimatePresence>
                {showHomeLink && (
                  <motion.div
                    key="home-link"
                    className="home-link-in-menu"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button 
                      onClick={scrollToTop} 
                      className="menu-link" 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        padding: 0, 
                        cursor: 'pointer', 
                        fontFamily: "'TG Girthy Ultra', sans-serif", 
                        fontWeight: 'bold', 
                        fontSize: '0.875rem', 
                        letterSpacing: '0.03em',
                        pointerEvents: 'auto',
                        position: 'relative',
                        zIndex: 103
                      }}
                    >
                      TINY SUITCASE
                      <motion.span
                        className="menu-underline"
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Centered menu items container */}
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
                    <Link href={item.href} className={`menu-link ${item.label === 'Work' ? 'menu-link-work' : ''}`}>
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
              <p className="subtitle-text">content studio & travel concierge</p>
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
                setShowCalendlyOverlay(true)
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
      <section className="scroll-snap-section section-2-svg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="section-2-container"
        >
          {/* Title */}
          <h2 className="section-2-title">OUR CORE SERVICES</h2>

          {/* Content with curved line */}
          <div className="section-2-content">
            {/* Left side - FOR BRANDS */}
            <div className="section-2-left">
              <h3 className="section-2-subtitle">FOR BRANDS</h3>
              <ul className="section-2-list">
                <li>Fora Travel + logistics</li>
                <li>content-driven itineraries</li>
                <li>creative direction</li>
                <li>on-site support</li>
              </ul>
            </div>

            {/* Curved line in the middle */}
            {/* <div className="section-2-curve">
              <Image
                src="/images/section2/curveline.png"
                alt=""
                width={10}
                height={300}
                className="curve-line"
                unoptimized
              />
            </div> */}

            {/* Right side - FOR HOTELS */}
            <div className="section-2-right">
              <h3 className="section-2-subtitle">FOR HOTELS</h3>
              <ul className="section-2-list">
                <li>CONTENT</li>
                <li>CAMPAIGNS</li>
                <li>INFLUENCER MARKETING</li>
                <li>BRAND CONCIERGE</li>
              </ul>
            </div>
          </div>

          {/* Learn More Button */}
          <motion.div
            className="section-2-button-container"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
          >
            <Link href="/services" className="learn-more-link">
              <button className="consultation-button learn-more-button">
                LEARN MORE
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 3 */}
      <section className="scroll-snap-section section-3-split">
        <div className="section-3-container">
          {/* Left side - 65% */}
          <motion.div
            className="section-3-left"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-3-title">
              <span>12 YEARS</span>
              <span>IN</span>
              <span>ADVERTISING</span>
            </h2>
            <h3 className="section-3-subtitle">
              trusted by over 50<br />
              global agencies & top brands
            </h3>
          </motion.div>

          {/* Right side - 35% */}
          <motion.div
            className="section-3-right"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            {/* Blank for now */}
          </motion.div>
          
          {/* Credits container - bottom left */}
          <div className="section-3-credits-container">
            <div className="section-3-credits">
              <div className="credits-item">Classpass</div>
              <div className="credits-item">eBay Luxury Watches</div>
              <div className="credits-item">TRESemmé</div>
              <div className="credits-item">Love Beauty & Planet</div>
              <div className="credits-item">Don Julio</div>
              <div className="credits-item">Lululemon</div>
              <div className="credits-item">Volvo</div>
              <div className="credits-item">Project Runway</div>
              <div className="credits-item">Clairol</div>
              <div className="credits-item">ELLE</div>
              <div className="credits-item">Gillette Venus</div>
              <div className="credits-item">Olay</div>
              <div className="credits-item">L&apos;Oreal</div>
              <div className="credits-item">Clean & Clear</div>
              <div className="credits-item">NYFW</div>
              <div className="credits-item">Glosslab</div>
              <div className="credits-item">Love Home & Planet</div>
              <div className="credits-item">Ponds</div>
              <div className="credits-item">Weight Watchers</div>
              <div className="credits-item">St. Ives</div>
              <div className="credits-item">Coca‑Cola Brands</div>
              <div className="credits-item">Applebee&apos;s</div>
              <div className="credits-item">Cadillac</div>
              <div className="credits-item">Krispy Kreme</div>
              <div className="credits-item">WeWork</div>
              <div className="credits-item">Classpass</div>
              <div className="credits-item">eBay Luxury Watches</div>
              <div className="credits-item">TRESemmé</div>
              <div className="credits-item">Love Beauty & Planet</div>
              <div className="credits-item">Don Julio</div>
              <div className="credits-item">Lululemon</div>
              <div className="credits-item">Volvo</div>
              <div className="credits-item">Project Runway</div>
              <div className="credits-item">Clairol</div>
              <div className="credits-item">ELLE</div>
              <div className="credits-item">Gillette Venus</div>
              <div className="credits-item">Olay</div>
              <div className="credits-item">L&apos;Oreal</div>
              <div className="credits-item">Clean & Clear</div>
              <div className="credits-item">NYFW</div>
              <div className="credits-item">Glosslab</div>
              <div className="credits-item">Love Home & Planet</div>
              <div className="credits-item">Ponds</div>
              <div className="credits-item">Weight Watchers</div>
              <div className="credits-item">St. Ives</div>
              <div className="credits-item">Coca‑Cola Brands</div>
              <div className="credits-item">Applebee&apos;s</div>
              <div className="credits-item">Cadillac</div>
              <div className="credits-item">Krispy Kreme</div>
              <div className="credits-item">WeWork</div>
              <div className="credits-item">Classpass</div>
              <div className="credits-item">eBay Luxury Watches</div>
              <div className="credits-item">TRESemmé</div>
              <div className="credits-item">Love Beauty & Planet</div>
              <div className="credits-item">Don Julio</div>
              <div className="credits-item">Lululemon</div>
              <div className="credits-item">Volvo</div>
              <div className="credits-item">Project Runway</div>
              <div className="credits-item">Clairol</div>
              <div className="credits-item">ELLE</div>
              <div className="credits-item">Gillette Venus</div>
              <div className="credits-item">Olay</div>
              <div className="credits-item">L&apos;Oreal</div>
              <div className="credits-item">Clean & Clear</div>
              <div className="credits-item">NYFW</div>
              <div className="credits-item">Glosslab</div>
              <div className="credits-item">Love Home & Planet</div>
              <div className="credits-item">Ponds</div>
              <div className="credits-item">Weight Watchers</div>
              <div className="credits-item">St. Ives</div>
              <div className="credits-item">Coca‑Cola Brands</div>
              <div className="credits-item">Applebee&apos;s</div>
              <div className="credits-item">Cadillac</div>
              <div className="credits-item">Krispy Kreme</div>
              <div className="credits-item">WeWork</div>
              <div className="credits-item">Classpass</div>
              <div className="credits-item">eBay Luxury Watches</div>
              <div className="credits-item">TRESemmé</div>
              <div className="credits-item">Love Beauty & Planet</div>
              <div className="credits-item">Don Julio</div>
              <div className="credits-item">Lululemon</div>
              <div className="credits-item">Volvo</div>
              <div className="credits-item">Project Runway</div>
              <div className="credits-item">Clairol</div>
              <div className="credits-item">ELLE</div>
              <div className="credits-item">Gillette Venus</div>
              <div className="credits-item">Olay</div>
              <div className="credits-item">L&apos;Oreal</div>
              <div className="credits-item">Clean & Clear</div>
              <div className="credits-item">NYFW</div>
              <div className="credits-item">Glosslab</div>
              <div className="credits-item">Love Home & Planet</div>
              <div className="credits-item">Ponds</div>
              <div className="credits-item">Weight Watchers</div>
              <div className="credits-item">St. Ives</div>
              <div className="credits-item">Coca‑Cola Brands</div>
              <div className="credits-item">Applebee&apos;s</div>
              <div className="credits-item">Cadillac</div>
              <div className="credits-item">Krispy Kreme</div>
              <div className="credits-item">WeWork</div>
              <div className="credits-item">Classpass</div>
              <div className="credits-item">eBay Luxury Watches</div>
              <div className="credits-item">TRESemmé</div>
              <div className="credits-item">Love Beauty & Planet</div>
              <div className="credits-item">Don Julio</div>
              <div className="credits-item">Lululemon</div>
              <div className="credits-item">Volvo</div>
              <div className="credits-item">Project Runway</div>
              <div className="credits-item">Clairol</div>
              <div className="credits-item">ELLE</div>
              <div className="credits-item">Gillette Venus</div>
              <div className="credits-item">Olay</div>
              <div className="credits-item">L&apos;Oreal</div>
              <div className="credits-item">Clean & Clear</div>
              <div className="credits-item">NYFW</div>
              <div className="credits-item">Glosslab</div>
              <div className="credits-item">Love Home & Planet</div>
              <div className="credits-item">Ponds</div>
              <div className="credits-item">Weight Watchers</div>
              <div className="credits-item">St. Ives</div>
              <div className="credits-item">Coca‑Cola Brands</div>
              <div className="credits-item">Applebee&apos;s</div>
              <div className="credits-item">Cadillac</div>
              <div className="credits-item">Krispy Kreme</div>
              <div className="credits-item">WeWork</div>
              <div className="credits-item">Classpass</div>
              <div className="credits-item">eBay Luxury Watches</div>
              <div className="credits-item">TRESemmé</div>
              <div className="credits-item">Love Beauty & Planet</div>
              <div className="credits-item">Don Julio</div>
              <div className="credits-item">Lululemon</div>
              <div className="credits-item">Volvo</div>
              <div className="credits-item">Project Runway</div>
              <div className="credits-item">Clairol</div>
              <div className="credits-item">ELLE</div>
              <div className="credits-item">Gillette Venus</div>
              <div className="credits-item">Olay</div>
              <div className="credits-item">L&apos;Oreal</div>
              <div className="credits-item">Clean & Clear</div>
              <div className="credits-item">NYFW</div>
              <div className="credits-item">Glosslab</div>
              <div className="credits-item">Love Home & Planet</div>
              <div className="credits-item">Ponds</div>
              <div className="credits-item">Weight Watchers</div>
              <div className="credits-item">St. Ives</div>
              <div className="credits-item">Coca‑Cola Brands</div>
              <div className="credits-item">Applebee&apos;s</div>
              <div className="credits-item">Cadillac</div>
              <div className="credits-item">Krispy Kreme</div>
              <div className="credits-item">WeWork</div>
              <div className="credits-item">Classpass</div>
              <div className="credits-item">eBay Luxury Watches</div>
              <div className="credits-item">TRESemmé</div>
              <div className="credits-item">Love Beauty & Planet</div>
              <div className="credits-item">Don Julio</div>
              <div className="credits-item">Lululemon</div>
              <div className="credits-item">Volvo</div>
              <div className="credits-item">Project Runway</div>
              <div className="credits-item">Clairol</div>
              <div className="credits-item">ELLE</div>
              <div className="credits-item">Gillette Venus</div>
              <div className="credits-item">Olay</div>
              <div className="credits-item">L&apos;Oreal</div>
              <div className="credits-item">Clean & Clear</div>
              <div className="credits-item">NYFW</div>
              <div className="credits-item">Glosslab</div>
              <div className="credits-item">Love Home & Planet</div>
              <div className="credits-item">Ponds</div>
              <div className="credits-item">Weight Watchers</div>
              <div className="credits-item">St. Ives</div>
              <div className="credits-item">Coca‑Cola Brands</div>
              <div className="credits-item">Applebee&apos;s</div>
              <div className="credits-item">Cadillac</div>
              <div className="credits-item">Krispy Kreme</div>
              <div className="credits-item">WeWork</div>
              <div className="credits-item">Classpass</div>
              <div className="credits-item">eBay Luxury Watches</div>
              <div className="credits-item">TRESemmé</div>
              <div className="credits-item">Love Beauty & Planet</div>
              <div className="credits-item">Don Julio</div>
              <div className="credits-item">Lululemon</div>
              <div className="credits-item">Volvo</div>
              <div className="credits-item">Project Runway</div>
              <div className="credits-item">Clairol</div>
              <div className="credits-item">ELLE</div>
              <div className="credits-item">Gillette Venus</div>
              <div className="credits-item">Olay</div>
              <div className="credits-item">L&apos;Oreal</div>
              <div className="credits-item">Clean & Clear</div>
              <div className="credits-item">NYFW</div>
              <div className="credits-item">Glosslab</div>
              <div className="credits-item">Love Home & Planet</div>
              <div className="credits-item">Ponds</div>
              <div className="credits-item">Weight Watchers</div>
              <div className="credits-item">St. Ives</div>
              <div className="credits-item">Coca‑Cola Brands</div>
              <div className="credits-item">Applebee&apos;s</div>
              <div className="credits-item">Cadillac</div>
              <div className="credits-item">Krispy Kreme</div>
              <div className="credits-item">WeWork</div>
              <div className="credits-item">Classpass</div>
              <div className="credits-item">eBay Luxury Watches</div>
              <div className="credits-item">TRESemmé</div>
              <div className="credits-item">Love Beauty & Planet</div>
              <div className="credits-item">Don Julio</div>
              <div className="credits-item">Lululemon</div>
              <div className="credits-item">Volvo</div>
              <div className="credits-item">Project Runway</div>
              <div className="credits-item">Clairol</div>
              <div className="credits-item">ELLE</div>
              <div className="credits-item">Gillette Venus</div>
              <div className="credits-item">Olay</div>
              <div className="credits-item">L&apos;Oreal</div>
              <div className="credits-item">Clean & Clear</div>
              <div className="credits-item">NYFW</div>
              <div className="credits-item">Glosslab</div>
              <div className="credits-item">Love Home & Planet</div>
              <div className="credits-item">Ponds</div>
              <div className="credits-item">Weight Watchers</div>
              <div className="credits-item">St. Ives</div>
              <div className="credits-item">Coca‑Cola Brands</div>
              <div className="credits-item">Applebee&apos;s</div>
              <div className="credits-item">Cadillac</div>
              <div className="credits-item">Krispy Kreme</div>
              <div className="credits-item">WeWork</div>
              <div className="credits-item">Classpass</div>
              <div className="credits-item">eBay Luxury Watches</div>
              <div className="credits-item">TRESemmé</div>
              <div className="credits-item">Love Beauty & Planet</div>
              <div className="credits-item">Don Julio</div>
              <div className="credits-item">Lululemon</div>
              <div className="credits-item">Volvo</div>
              <div className="credits-item">Project Runway</div>
              <div className="credits-item">Clairol</div>
              <div className="credits-item">ELLE</div>
              <div className="credits-item">Gillette Venus</div>
              <div className="credits-item">Olay</div>
              <div className="credits-item">L&apos;Oreal</div>
              <div className="credits-item">Clean & Clear</div>
              <div className="credits-item">NYFW</div>
              <div className="credits-item">Glosslab</div>
              <div className="credits-item">Love Home & Planet</div>
              <div className="credits-item">Ponds</div>
              <div className="credits-item">Weight Watchers</div>
              <div className="credits-item">St. Ives</div>
              <div className="credits-item">Coca‑Cola Brands</div>
              <div className="credits-item">Applebee&apos;s</div>
              <div className="credits-item">Cadillac</div>
              <div className="credits-item">Krispy Kreme</div>
              <div className="credits-item">WeWork</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 */}
      <section className="scroll-snap-section section-4-split">
        <div className="section-4-container">
          {/* Left side - Background image 65% */}
          <motion.div
            className="section-4-left"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="section-4-image-wrapper">
              <Image
                src="/images/section4/BackgroundSec4.png"
                alt=""
                fill
                className="section-4-image"
                sizes="(min-width: 1024px) 65vw, 100vw"
                priority={false}
              />
            </div>
          </motion.div>

          {/* Middle - Title */}
          <motion.div
            className="section-4-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h2 className="section-4-title">ready to get started?</h2>
          </motion.div>

          {/* Right - Call to action */}
          <motion.div
            className="section-4-right"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="section-4-cta">WORK WITH US</span>
          </motion.div>
        </div>
      </section>
      {showCalendlyOverlay && (
        <div className="calendly-overlay" onClick={() => setShowCalendlyOverlay(false)}>
          <div className="calendly-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="calendly-close-button"
              onClick={() => setShowCalendlyOverlay(false)}
            >
              ✕
            </button>
            <iframe
              src="https://calendly.com/tinysuitcasestudios/30min"
              className="calendly-iframe"
              title="Book a consultation"
              frameBorder="0"
            />
          </div>
        </div>
      )}
    </main>
  )
}


