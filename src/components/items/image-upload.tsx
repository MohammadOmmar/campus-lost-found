'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X } from 'lucide-react'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface ImageUploadProps {
  onImageSelected: (file: File | null) => void
  onImageRemoved: () => void
  currentImageUrl?: string | null
  disabled?: boolean
}

export function ImageUpload({
  onImageSelected,
  onImageRemoved,
  currentImageUrl,
  disabled = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateAndSelectFile = useCallback(
    (file: File) => {
      setError(null)

      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('Only JPEG, PNG, and WebP images are allowed.')
        return
      }

      if (file.size > MAX_FILE_SIZE) {
        setError('Image must be less than 5MB.')
        return
      }

      setPreview(URL.createObjectURL(file))
      onImageSelected(file)
    },
    [onImageSelected]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      validateAndSelectFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return

    const file = e.dataTransfer.files?.[0]
    if (file) {
      validateAndSelectFile(file)
    }
  }

  const handleRemove = () => {
    if (preview && !currentImageUrl) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    setError(null)
    onImageRemoved()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative aspect-video bg-secondary/50 rounded-2xl overflow-hidden border border-border/40"
          >
            {/* eslint-disable @next/next/no-img-element -- blob: URLs cannot be optimized by next/image */}
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {/* eslint-enable @next/next/no-img-element */}
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-3 right-3 p-2 bg-background/90 backdrop-blur-sm rounded-full text-foreground hover:bg-background transition-colors"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
              disabled={disabled}
            />
            <label
              htmlFor="image-upload"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border/40 bg-secondary/20 hover:border-border/60 hover:bg-secondary/30'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-body font-medium text-foreground mb-1">
                Drop an image or click to upload
              </p>
              <p className="text-small text-muted-foreground">
                JPEG, PNG, or WebP —" max 5MB
              </p>
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-small text-destructive">{error}</p>
      )}
    </div>
  )
}
