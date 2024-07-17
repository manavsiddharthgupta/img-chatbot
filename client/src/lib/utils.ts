import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const MAX_FILE_SIZE = 5 * 1024 * 1024

export function validateFile(file: File) {
  const validTypes = ['image/png', 'image/jpeg', 'image/webp']
  if (!validTypes.includes(file.type)) {
    throw new Error(
      'Invalid file type. Please upload a PNG, JPG, or WebP image.'
    )
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5 MB. Please upload a smaller image.')
  }

  return true
}
