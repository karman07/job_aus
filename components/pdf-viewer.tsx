'use client'

import { useState, useEffect } from 'react'
import { X, ZoomIn, ZoomOut } from 'lucide-react'

interface FileViewerProps {
  fileUrl: string
  isOpen: boolean
  onClose: () => void
  applicantName: string
  fileType?: string
}

export function FileViewer({ fileUrl, isOpen, onClose, applicantName, fileType }: FileViewerProps) {
  const [objectUrl, setObjectUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (isOpen && fileUrl) {
      fetchFile()
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [isOpen, fileUrl])

  const fetchFile = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/${fileUrl}`)
      if (!response.ok) throw new Error('Failed to fetch file')
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setObjectUrl(url)
      setError('')
    } catch (err) {
      setError('Failed to load file')
      console.error('Error loading file:', err)
    } finally {
      setLoading(false)
    }
  }

  const getFileType = () => {
    if (fileType) return fileType
    const extension = fileUrl.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return 'image'
    if (extension === 'pdf') return 'pdf'
    return 'unknown'
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <a
            href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/${fileUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Open in New Tab
          </a>
        </div>
      )
    }

    const type = getFileType()

    if (type === 'image') {
      return (
        <div className="flex justify-center items-center h-full">
          <img
            src={objectUrl}
            alt={`Resume - ${applicantName}`}
            className="max-w-full max-h-full object-contain"
            style={{ transform: `scale(${scale})` }}
          />
        </div>
      )
    }

    if (type === 'pdf') {
      return (
        <div className="h-full">
          <embed
            src={objectUrl}
            type="application/pdf"
            className="w-full h-full min-h-[600px]"
          />
        </div>
      )
    }

    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          File type not supported for preview
        </p>
        <a
          href={objectUrl}
          download
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Download File
        </a>
      </div>
    )
  }

  if (!isOpen) return null

  const showZoomControls = getFileType() === 'image'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Resume - {applicantName}
          </h3>
          <div className="flex items-center space-x-2">
            {showZoomControls && (
              <>
                <button
                  onClick={() => setScale(prev => Math.max(prev - 0.2, 0.5))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={() => setScale(prev => Math.min(prev + 0.2, 3))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}