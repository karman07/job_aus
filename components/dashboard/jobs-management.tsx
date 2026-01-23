'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react'
import { Pagination } from '../pagination'

interface ICompany {
  name?: string;
  description?: string;
  website?: string;
  logo?: string;
  size?: string;
  founded?: number;
  industry?: ('health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology')[];
  location?: string;
  contact?: {
    email?: string;
    phone?: string;
  };
}

interface IJob {
  _id: string;
  title: string;
  description?: string;
  requirements?: string;
  keyResponsibilities?: string;
  contentFile?: string;
  location: string;
  state: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
  type: 'Full Time' | 'Part Time' | 'Contract' | 'FIFO 2:1' | 'FIFO 8:6';
  jobTypeCategory: 'Permanent' | 'Contract' | 'Apprenticeship' | 'Trainee';
  workType: 'On-Site' | 'Remote' | 'Hybrid';
  industry: 'health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology';
  salaryDisplay?: string;
  salaryMin?: number;
  salaryMax?: number;
  tags: string[];
  status: 'active' | 'inactive' | 'closed';
  sponsorshipAvailable?: boolean;
  company: ICompany;
  postedBy?: string;
  applicantCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface JobsManagementProps {
  onDataUpdate?: (data: IJob[]) => void
}

export function JobsManagement({ onDataUpdate }: JobsManagementProps) {
  const [jobs, setJobs] = useState<IJob[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingJob, setEditingJob] = useState<IJob | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    keyResponsibilities: '',
    location: '',
    state: 'NSW' as IJob['state'],
    type: 'Full Time' as IJob['type'],
    jobTypeCategory: 'Permanent' as IJob['jobTypeCategory'],
    workType: 'On-Site' as IJob['workType'],
    industry: 'technology' as IJob['industry'],
    salaryDisplay: '',
    salaryMin: '',
    salaryMax: '',
    tags: '',
    status: 'active' as IJob['status'],
    sponsorshipAvailable: false,
    companyName: '',
    companyDescription: '',
    companyWebsite: '',
    companySize: '',
    companyFounded: new Date().getFullYear(),
    companyIndustry: 'technology' as IJob['industry'],
    companyLocation: '',
    companyEmail: '',
    companyPhone: '',
    useContentFile: false
  })
  const [files, setFiles] = useState({
    logo: null as File | null,
    contentFile: null as File | null
  })
  const [filePreviews, setFilePreviews] = useState({
    logoPreview: null as string | null,
    contentPreview: null as string | null
  })

  useEffect(() => {
    fetchJobs()
  }, [currentPage])

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token')
      console.log('Jobs - Token being used:', token)
      
      if (!token) {
        console.error('No token found')
        setJobs([])
        return
      }

      // Try without pagination first to test the endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Jobs Response status:', response.status)
      
      if (response.status === 401) {
        console.error('Jobs - Token expired or invalid - but keeping token for debugging')
        const errorText = await response.text()
        console.error('Jobs 401 Error details:', errorText)
        setJobs([])
        return
      }
      
      if (response.ok) {
        const data = await response.json()
        console.log('Jobs API Response:', data)
        const jobsData = data.data?.jobs || data.jobs || []
        setJobs(jobsData)
        setTotalPages(Math.ceil(jobsData.length / itemsPerPage))
        onDataUpdate?.(jobsData)
      } else {
        const errorText = await response.text()
        console.error('Jobs API Error:', response.status, errorText)
        setJobs([])
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('🚀 handleSubmit called!')
    e.preventDefault()
    console.log('📋 Form data:', formData)
    console.log('📁 Files state:', files)
    
    const token = localStorage.getItem('token')
    console.log('🔑 Token exists:', !!token)
    
    // Validation: If using content file, ensure file is selected (only for new jobs)
    if (formData.useContentFile && !files.contentFile && !editingJob?.contentFile) {
      console.log('❌ Validation failed: Content file required but not selected')
      alert('Please select a content file or switch to manual entry mode.')
      return
    }
    
    console.log('✅ Validation passed, proceeding with submission...')
    
    try {
      if (editingJob) {
        console.log('📝 Updating job with FormData...')
        const formDataObj = new FormData()
        formDataObj.append('title', formData.title)
        formDataObj.append('location', formData.location)
        formDataObj.append('state', formData.state)
        formDataObj.append('type', formData.type)
        formDataObj.append('jobTypeCategory', formData.jobTypeCategory)
        formDataObj.append('workType', formData.workType)
        formDataObj.append('industry', formData.industry)
        formDataObj.append('salaryDisplay', formData.salaryDisplay)
        if (formData.salaryMin) formDataObj.append('salaryMin', formData.salaryMin)
        if (formData.salaryMax) formDataObj.append('salaryMax', formData.salaryMax)
        formDataObj.append('tags', JSON.stringify(formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)))
        formDataObj.append('status', formData.status)
        formDataObj.append('sponsorshipAvailable', formData.sponsorshipAvailable.toString())
        
        // Add text content fields if not using content file
        if (!formData.useContentFile) {
          if (formData.description) formDataObj.append('description', formData.description)
          if (formData.requirements) formDataObj.append('requirements', formData.requirements)
          if (formData.keyResponsibilities) formDataObj.append('keyResponsibilities', formData.keyResponsibilities)
        }
        
        if (formData.companyName) formDataObj.append('company.name', formData.companyName)
        if (formData.companyDescription) formDataObj.append('company.description', formData.companyDescription)
        if (formData.companyWebsite) formDataObj.append('company.website', formData.companyWebsite)
        if (formData.companySize) formDataObj.append('company.size', formData.companySize)
        if (formData.companyFounded) formDataObj.append('company.founded', formData.companyFounded.toString())
        if (formData.companyIndustry) formDataObj.append('company.industry', JSON.stringify([formData.companyIndustry]))
        if (formData.companyLocation) formDataObj.append('company.location', formData.companyLocation)
        if (formData.companyEmail) formDataObj.append('company.contact.email', formData.companyEmail)
        if (formData.companyPhone) formDataObj.append('company.contact.phone', formData.companyPhone)
        
        // Add files at the END
        if (files.contentFile) {
          console.log('✅ Appending contentFile for update')
          formDataObj.append('contentFile', files.contentFile, files.contentFile.name)
        }
        
        if (files.logo) {
          console.log('✅ Appending logo for update')
          formDataObj.append('logo', files.logo, files.logo.name)
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/admin/${editingJob._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataObj
        })

        if (response.ok) {
          fetchJobs()
          setShowModal(false)
          resetForm()
        }
      } else {
        console.log('📦 Creating new job with FormData...')
        const formDataObj = new FormData()
        formDataObj.append('title', formData.title)
        formDataObj.append('location', formData.location)
        formDataObj.append('state', formData.state)
        formDataObj.append('type', formData.type)
        formDataObj.append('jobTypeCategory', formData.jobTypeCategory)
        formDataObj.append('workType', formData.workType)
        formDataObj.append('industry', formData.industry)
        formDataObj.append('salaryDisplay', formData.salaryDisplay)
        if (formData.salaryMin) formDataObj.append('salaryMin', formData.salaryMin)
        if (formData.salaryMax) formDataObj.append('salaryMax', formData.salaryMax)
        formDataObj.append('tags', JSON.stringify(formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)))
        formDataObj.append('status', formData.status)
        formDataObj.append('sponsorshipAvailable', formData.sponsorshipAvailable.toString())
        
        // Add text content fields if not using content file
        if (!formData.useContentFile) {
          if (formData.description) formDataObj.append('description', formData.description)
          if (formData.requirements) formDataObj.append('requirements', formData.requirements)
          if (formData.keyResponsibilities) formDataObj.append('keyResponsibilities', formData.keyResponsibilities)
        }
        
        if (formData.companyName) formDataObj.append('company.name', formData.companyName)
        if (formData.companyDescription) formDataObj.append('company.description', formData.companyDescription)
        if (formData.companyWebsite) formDataObj.append('company.website', formData.companyWebsite)
        if (formData.companySize) formDataObj.append('company.size', formData.companySize)
        if (formData.companyFounded) formDataObj.append('company.founded', formData.companyFounded.toString())
        if (formData.companyIndustry) formDataObj.append('company.industry', JSON.stringify([formData.companyIndustry]))
        if (formData.companyLocation) formDataObj.append('company.location', formData.companyLocation)
        if (formData.companyEmail) formDataObj.append('company.contact.email', formData.companyEmail)
        if (formData.companyPhone) formDataObj.append('company.contact.phone', formData.companyPhone)
        
        // IMPORTANT: Add files at the END (matching Postman curl format)
        console.log('📁 Files state before upload:', files)
        
        // ALWAYS append contentFile if it exists, regardless of useContentFile flag
        if (files.contentFile) {
          console.log('✅ Appending contentFile:', {
            name: files.contentFile.name,
            size: files.contentFile.size,
            type: files.contentFile.type
          })
          formDataObj.append('contentFile', files.contentFile, files.contentFile.name)
        } else {
          console.log('⚠️ No contentFile to upload')
        }
        
        if (files.logo) {
          console.log('✅ Appending logo:', {
            name: files.logo.name,
            size: files.logo.size,
            type: files.logo.type
          })
          formDataObj.append('logo', files.logo, files.logo.name)
        } else {
          console.log('⚠️ No logo to upload')
        }

        // Debug: Log all FormData entries
        console.log('FormData entries:')
        const formDataEntries = []
        for (let [key, value] of formDataObj.entries()) {
          if (value instanceof File) {
            const fileInfo = `[File: ${value.name}, ${value.size} bytes, ${value.type}]`
            console.log(key, fileInfo)
            formDataEntries.push({ key, value: fileInfo, isFile: true })
          } else {
            console.log(key, value)
            formDataEntries.push({ key, value, isFile: false })
          }
        }
        console.log('Total FormData entries:', formDataEntries.length)
        console.log('Files in FormData:', formDataEntries.filter(entry => entry.isFile))

        console.log('Sending request to:', `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`)
        console.log('Request method: POST')
        console.log('Request body type:', formDataObj.constructor.name)
        console.log('Files attached:', {
          logo: files.logo ? `${files.logo.name} (${files.logo.size} bytes)` : 'None',
          contentFile: files.contentFile ? `${files.contentFile.name} (${files.contentFile.size} bytes)` : 'None'
        })
        
        // Final check before sending
        console.log('About to send FormData with:', {
          totalEntries: Array.from(formDataObj.entries()).length,
          hasLogo: formDataObj.has('logo'),
          hasContentFile: formDataObj.has('contentFile'),
          logoFile: formDataObj.get('logo'),
          contentFile: formDataObj.get('contentFile')
        })
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
            // CRITICAL: No Content-Type header - browser will set multipart/form-data automatically
          },
          body: formDataObj // This MUST be FormData object, not JSON
        })

        console.log('Response status:', response.status)
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Response error:', errorText)
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }

        console.log('Job created successfully')
        fetchJobs()
        setShowModal(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving job:', error)
    }
  }

  const handleEdit = (job: IJob) => {
    setEditingJob(job)
    setFormData({
      title: job.title,
      description: job.description || '',
      requirements: job.requirements || '',
      keyResponsibilities: job.keyResponsibilities || '',
      location: job.location,
      state: job.state,
      type: job.type,
      jobTypeCategory: job.jobTypeCategory,
      workType: job.workType,
      industry: job.industry,
      salaryDisplay: job.salaryDisplay || '',
      salaryMin: job.salaryMin?.toString() || '',
      salaryMax: job.salaryMax?.toString() || '',
      tags: job.tags.join(', '),
      status: job.status,
      sponsorshipAvailable: job.sponsorshipAvailable || false,
      companyName: job.company.name || '',
      companyDescription: job.company.description || '',
      companyWebsite: job.company.website || '',
      companySize: job.company.size || '',
      companyFounded: job.company.founded || new Date().getFullYear(),
      companyIndustry: job.company.industry?.[0] || 'technology',
      companyLocation: job.company.location || '',
      companyEmail: job.company.contact?.email || '',
      companyPhone: job.company.contact?.phone || '',
      useContentFile: !!job.contentFile
    })
    setShowModal(true)
  }

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/admin/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        fetchJobs()
      }
    } catch (error) {
      console.error('Error deleting job:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      requirements: '',
      keyResponsibilities: '',
      location: '',
      state: 'NSW' as IJob['state'],
      type: 'Full Time' as IJob['type'],
      jobTypeCategory: 'Permanent' as IJob['jobTypeCategory'],
      workType: 'On-Site' as IJob['workType'],
      industry: 'technology' as IJob['industry'],
      salaryDisplay: '',
      salaryMin: '',
      salaryMax: '',
      tags: '',
      status: 'active' as IJob['status'],
      sponsorshipAvailable: false,
      companyName: '',
      companyDescription: '',
      companyWebsite: '',
      companySize: '',
      companyFounded: new Date().getFullYear(),
      companyIndustry: 'technology' as IJob['industry'],
      companyLocation: '',
      companyEmail: '',
      companyPhone: '',
      useContentFile: false
    })
    setFiles({
      logo: null,
      contentFile: null
    })
    setFilePreviews({
      logoPreview: null,
      contentPreview: null
    })
    setEditingJob(null)
  }

  const handleFileChange = async (file: File | null, type: 'logo' | 'contentFile') => {
    setFiles(prev => ({ ...prev, [type]: file }))
    
    if (!file) {
      setFilePreviews(prev => ({ ...prev, [`${type}Preview`]: null }))
      return
    }
    
    if (type === 'logo' && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => setFilePreviews(prev => ({ ...prev, logoPreview: e.target?.result as string }))
      reader.readAsDataURL(file)
    } else if (type === 'contentFile' && (file.name.endsWith('.md') || file.name.endsWith('.markdown'))) {
      const reader = new FileReader()
      reader.onload = (e) => setFilePreviews(prev => ({ ...prev, contentPreview: e.target?.result as string }))
      reader.readAsText(file)
    }
  }

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.company.name && job.company.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Jobs Management</h2>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Job</span>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Job Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Files
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No jobs found</td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job._id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{job.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{job.location}, {job.state} • {job.type}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{job.workType} • {job.industry}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {job.company.logo && (
                          <img 
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}${job.company.logo}`} 
                            alt="Logo" 
                            className="h-8 w-8 rounded object-cover"
                          />
                        )}
                        <span className="text-sm text-gray-900 dark:text-white">{job.company.name || 'No company'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {job.company.logo && (
                          <a 
                            href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}${job.company.logo}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Logo
                          </a>
                        )}
                        {job.contentFile && (
                          <a 
                            href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}${job.contentFile}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 rounded transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Content
                          </a>
                        )}
                        {!job.company.logo && !job.contentFile && (
                          <span className="text-xs text-gray-400 italic">No files</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {job.salaryDisplay || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {job.applicantCount || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        job.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : job.status === 'inactive'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : job.status === 'closed'
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(job)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {editingJob ? 'Edit Job' : 'Add New Job'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Job Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Industry
                      </label>
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData({...formData, industry: e.target.value as IJob['industry']})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="technology">Technology</option>
                        <option value="health">Health</option>
                        <option value="hospitality">Hospitality</option>
                        <option value="childcare">Childcare</option>
                        <option value="construction">Construction</option>
                        <option value="mining">Mining</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Location & Type</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        State
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value as IJob['state']})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="NSW">NSW</option>
                        <option value="VIC">VIC</option>
                        <option value="QLD">QLD</option>
                        <option value="WA">WA</option>
                        <option value="SA">SA</option>
                        <option value="TAS">TAS</option>
                        <option value="ACT">ACT</option>
                        <option value="NT">NT</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Job Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value as IJob['type']})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                        <option value="Contract">Contract</option>
                        <option value="FIFO 2:1">FIFO 2:1</option>
                        <option value="FIFO 8:6">FIFO 8:6</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category
                      </label>
                      <select
                        value={formData.jobTypeCategory}
                        onChange={(e) => setFormData({...formData, jobTypeCategory: e.target.value as IJob['jobTypeCategory']})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="Permanent">Permanent</option>
                        <option value="Contract">Contract</option>
                        <option value="Apprenticeship">Apprenticeship</option>
                        <option value="Trainee">Trainee</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Work Type
                      </label>
                      <select
                        value={formData.workType}
                        onChange={(e) => setFormData({...formData, workType: e.target.value as IJob['workType']})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="On-Site">On-Site</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Salary Display
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., $80,000 - $100,000"
                        value={formData.salaryDisplay}
                        onChange={(e) => setFormData({...formData, salaryDisplay: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Min Salary (AUD)
                      </label>
                      <input
                        type="number"
                        placeholder="80000"
                        value={formData.salaryMin}
                        onChange={(e) => setFormData({...formData, salaryMin: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Max Salary (AUD)
                      </label>
                      <input
                        type="number"
                        placeholder="100000"
                        value={formData.salaryMax}
                        onChange={(e) => setFormData({...formData, salaryMax: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="JavaScript, React, Node.js"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Job Content - Available for both create and edit */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Job Content</h4>
                  
                  <div className="mb-4">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="contentType"
                          checked={!formData.useContentFile}
                          onChange={() => setFormData({...formData, useContentFile: false})}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Manual Entry (Description, Requirements, Responsibilities)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="contentType"
                          checked={formData.useContentFile}
                          onChange={() => setFormData({...formData, useContentFile: true})}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Upload Markdown File</span>
                      </label>
                    </div>
                  </div>

                  {formData.useContentFile ? (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        📄 Content File (.md, .markdown)
                      </label>
                      {editingJob?.contentFile && !files.contentFile ? (
                        <div className="mb-3 p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Current file:</p>
                          <a 
                            href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}${editingJob.contentFile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            {editingJob.contentFile.split('/').pop()}
                          </a>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Upload a new file to replace</p>
                        </div>
                      ) : null}
                      <input
                        type="file"
                        accept=".md,.markdown"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'contentFile')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      {files.contentFile && (
                        <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                          <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">✓ {files.contentFile.name} ({(files.contentFile.size / 1024).toFixed(2)} KB)</p>
                          {filePreviews.contentPreview && (
                            <div className="max-h-32 overflow-y-auto text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap font-mono">
                              {filePreviews.contentPreview.substring(0, 500)}{filePreviews.contentPreview.length > 500 ? '...' : ''}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Describe the job role and what the candidate will be doing..."
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Requirements
                          </label>
                          <textarea
                            rows={3}
                            placeholder="List the required skills, experience, and qualifications..."
                            value={formData.requirements}
                            onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Key Responsibilities
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Outline the main duties and responsibilities..."
                            value={formData.keyResponsibilities}
                            onChange={(e) => setFormData({...formData, keyResponsibilities: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Company Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company Website
                      </label>
                      <input
                        type="url"
                        value={formData.companyWebsite}
                        onChange={(e) => setFormData({...formData, companyWebsite: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.companyDescription}
                      onChange={(e) => setFormData({...formData, companyDescription: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Company Logo Upload - Available for both create and edit */}
                  <div className="mt-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        🏢 Company Logo
                      </label>
                      {editingJob?.company.logo && !files.logo ? (
                        <div className="mb-3 p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Current logo:</p>
                          <img 
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}${editingJob.company.logo}`}
                            alt="Current logo"
                            className="max-h-16 rounded mb-2"
                          />
                          <a 
                            href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}${editingJob.company.logo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            View full size
                          </a>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Upload a new file to replace</p>
                        </div>
                      ) : null}
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.svg"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'logo')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      {files.logo && (
                        <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                          <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">✓ {files.logo.name} ({(files.logo.size / 1024).toFixed(2)} KB)</p>
                          {filePreviews.logoPreview && (
                            <img src={filePreviews.logoPreview} alt="Logo preview" className="max-h-24 rounded" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company Size
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 50-100 employees"
                        value={formData.companySize}
                        onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Founded Year
                      </label>
                      <input
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={formData.companyFounded}
                        onChange={(e) => setFormData({...formData, companyFounded: parseInt(e.target.value) || new Date().getFullYear()})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company Industry
                      </label>
                      <select
                        value={formData.companyIndustry}
                        onChange={(e) => setFormData({...formData, companyIndustry: e.target.value as IJob['industry']})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="technology">Technology</option>
                        <option value="health">Health</option>
                        <option value="hospitality">Hospitality</option>
                        <option value="childcare">Childcare</option>
                        <option value="construction">Construction</option>
                        <option value="mining">Mining</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company Location
                      </label>
                      <input
                        type="text"
                        value={formData.companyLocation}
                        onChange={(e) => setFormData({...formData, companyLocation: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={formData.companyEmail}
                        onChange={(e) => setFormData({...formData, companyEmail: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.companyPhone}
                        onChange={(e) => setFormData({...formData, companyPhone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.sponsorshipAvailable}
                      onChange={(e) => setFormData({...formData, sponsorshipAvailable: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sponsorship Available</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as IJob['status']})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    {editingJob ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}