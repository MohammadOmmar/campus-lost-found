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
            className="relative aspect-video bg-base-700/50 rounded-lg overflow-hidden border border-border-subtle"
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
                className="absolute top-3 right-3 p-2 bg-background/90 backdrop-blur-sm rounded-full text-text-primary hover:bg-background transition-colors"
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
              className={`flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-primary bg-accent/5'
                  : 'border-border-subtle bg-base-700/20 hover:border-border-subtle hover:bg-base-700/30'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="w-12 h-12 rounded-lg bg-base-700 flex items-center justify-center mb-4">
                <Upload className="w-5 h-5 text-text-muted" />
              </div>
              <p className="text-body font-medium text-text-primary mb-1">
                Drop an image or click to upload
              </p>
              <p className="text-small text-text-muted">
                JPEG, PNG, or WebP —" max 5MB
              </p>
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-small text-status-lost">{error}</p>
      )}
    </div>
  )
}
