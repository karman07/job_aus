'use client'

import { useState } from 'react'
import { Upload, FileText, Image, User, Building2 } from 'lucide-react'

export function FileManagement() {
  const [uploading, setUploading] = useState(false)
  const [uploadResults, setUploadResults] = useState<string[]>([])

  const handleFileUpload = async (file: File, endpoint: string) => {
    setUploading(true)
    const formData = new FormData()
    
    // Determine the field name based on endpoint
    let fieldName = 'file'
    if (endpoint.includes('resume')) fieldName = 'resume'
    else if (endpoint.includes('logo')) fieldName = 'logo'
    else if (endpoint.includes('profile-photo')) fieldName = 'profilePhoto'
    
    formData.append(fieldName, file)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setUploadResults(prev => [...prev, `✅ ${file.name} uploaded successfully`])
      } else {
        setUploadResults(prev => [...prev, `❌ Failed to upload ${file.name}`])
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadResults(prev => [...prev, `❌ Error uploading ${file.name}`])
    } finally {
      setUploading(false)
    }
  }

  const uploadTypes = [
    {
      id: 'resume',
      title: 'Resume Upload',
      description: 'Upload candidate resumes (PDF, DOC, DOCX)',
      icon: FileText,
      accept: '.pdf,.doc,.docx',
      endpoint: 'resume',
      color: 'text-blue-600'
    },
    {
      id: 'logo',
      title: 'Company Logo Upload',
      description: 'Upload company logos (JPG, PNG, SVG)',
      icon: Building2,
      accept: '.jpg,.jpeg,.png,.svg',
      endpoint: 'logo',
      color: 'text-green-600'
    },
    {
      id: 'profile-photo',
      title: 'Profile Photo Upload',
      description: 'Upload profile photos (JPG, PNG)',
      icon: User,
      accept: '.jpg,.jpeg,.png',
      endpoint: 'profile-photo',
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">File Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uploadTypes.map((type) => {
          const Icon = type.icon
          return (
            <div key={type.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <Icon className={`h-8 w-8 ${type.color} mr-3`} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{type.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
                </div>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Drag and drop files here, or click to select
                </p>
                <input
                  type="file"
                  accept={type.accept}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleFileUpload(file, type.endpoint)
                    }
                  }}
                  className="hidden"
                  id={`file-${type.id}`}
                  disabled={uploading}
                />
                <label
                  htmlFor={`file-${type.id}`}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                    uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                  }`}
                >
                  {uploading ? 'Uploading...' : 'Select File'}
                </label>
              </div>
              
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                <p>Supported formats: {type.accept.replace(/\./g, '').toUpperCase()}</p>
                <p>Maximum file size: 10MB</p>
              </div>
            </div>
          )
        })}
      </div>

      {uploadResults.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Results</h3>
          <div className="space-y-2">
            {uploadResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))}
          </div>
          <button
            onClick={() => setUploadResults([])}
            className="mt-4 px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
          >
            Clear Results
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">File Upload Guidelines</h3>
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Resume Files</h4>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Supported formats: PDF, DOC, DOCX</li>
              <li>Maximum file size: 10MB</li>
              <li>Files are stored securely and accessible only to authorized users</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Company Logos</h4>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Supported formats: JPG, PNG, SVG</li>
              <li>Recommended size: 200x200px or larger</li>
              <li>Square aspect ratio preferred</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Profile Photos</h4>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Supported formats: JPG, PNG</li>
              <li>Recommended size: 400x400px</li>
              <li>Square aspect ratio required</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Security</h4>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>All files are scanned for malware</li>
              <li>Files are stored with unique names to prevent conflicts</li>
              <li>Access is controlled through authentication and authorization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}