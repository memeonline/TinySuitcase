import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Allowed image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.JPG', '.JPEG', '.PNG', '.WEBP', '.GIF']
// Excluded extensions (videos, etc.)
const EXCLUDED_EXTENSIONS = ['.mov', '.mp4', '.avi', '.MOV', '.MP4', '.AVI']

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'section1')
    
    // Check if directory exists
    if (!fs.existsSync(imagesDir)) {
      return NextResponse.json({ images: [] }, { status: 200 })
    }

    // Read directory
    const files = fs.readdirSync(imagesDir)
    
    // Filter for image files only
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file)
      // Must be an image extension and not excluded
      return IMAGE_EXTENSIONS.includes(ext) && !EXCLUDED_EXTENSIONS.includes(ext)
    })

    // Return sorted array of image filenames
    return NextResponse.json({ images: imageFiles.sort() })
  } catch (error) {
    console.error('Error reading images directory:', error)
    return NextResponse.json(
      { error: 'Failed to read images directory' },
      { status: 500 }
    )
  }
}

