import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Force Node.js runtime for filesystem access
export const runtime = 'nodejs'

// Allowed image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.JPG', '.JPEG', '.PNG', '.WEBP', '.GIF']
// Excluded extensions (videos, etc.)
const EXCLUDED_EXTENSIONS = ['.mov', '.mp4', '.avi', '.MOV', '.MP4', '.AVI']

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'section1')
    
    // Check if directory exists using promises API (works better in production)
    try {
      await fs.access(imagesDir)
    } catch (accessError) {
      console.error('Images directory does not exist:', imagesDir)
      return NextResponse.json({ images: [] }, { status: 200 })
    }

    // Read directory using promises API (async, works in production)
    const files = await fs.readdir(imagesDir)
    
    // Filter for image files only
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file)
      // Must be an image extension and not excluded
      return IMAGE_EXTENSIONS.includes(ext) && !EXCLUDED_EXTENSIONS.includes(ext)
    })

    console.log(`Found ${imageFiles.length} images in ${imagesDir}`)
    
    // Return sorted array of image filenames
    return NextResponse.json({ images: imageFiles.sort() })
  } catch (error) {
    console.error('Error reading images directory:', error)
    return NextResponse.json(
      { error: 'Failed to read images directory', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

