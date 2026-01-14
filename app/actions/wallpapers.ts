'use server'

import fs from 'fs'
import path from 'path'

export async function getRandomWallpaper() {
    const wallpapersDir = path.join(process.cwd(), 'public', 'wallpapers')

    try {
        if (!fs.existsSync(wallpapersDir)) {
            return null
        }

        const files = fs.readdirSync(wallpapersDir)
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

        const images = files.filter(file => {
            const ext = path.extname(file).toLowerCase()
            return imageExtensions.includes(ext)
        })

        if (images.length === 0) {
            return null
        }

        const randomImage = images[Math.floor(Math.random() * images.length)]
        return `/wallpapers/${randomImage}`
    } catch (error) {
        console.error('Error reading wallpapers directory:', error)
        return null
    }
}
