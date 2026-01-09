'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react'
import { Pagination } from '../pagination'

interface Job {
  _id: string
  title: string
  description: string
  requirements: string
  keyResponsibilities: string
  location: string
  state: string
  type: string
  jobTypeCategory: string
  workType: string
  industry: string
  salaryDisplay: string
  tags: string[]
  status: string
  company: {
    name: string
    description: string
    website: string
    logo: string
    size: string
    founded: number
    industry: string[]
    location: string
    contact: {
      email: string
      phone: string
    }
  }
  applicantCount: number
  viewCount: number
  createdAt: string
}

interface JobsManagementProps {
  onDataUpdate?: (data: Job[]) => void
}

export function JobsManagement({ onDataUpdate }: JobsManagementProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    keyResponsibilities: '',
    location: '',
    state: 'NSW',
    type: 'Full Time',
    jobTypeCategory: 'Permanent',
    workType: 'On-Site',
    industry: 'technology',
    salaryDisplay: '',
    tags: '',
    status: 'active',
    companyName: '',
    companyDescription: '',
    companyWebsite: '',
    companySize: '1-10',
    companyFounded: new Date().getFullYear(),
    companyIndustry: 'technology',
    companyLocation: '',
    companyEmail: '',
    companyPhone: ''
  })

  useEffect(() => {
    fetchJobs()
  }, [currentPage])

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/admin/all?page=${currentPage}&limit=${itemsPerPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        const jobsData = data.data?.jobs || []
        setJobs(jobsData)
        setTotalPages(data.data?.pagination?.pages || 1)
        onDataUpdate?.(jobsData)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    
    try {
      if (editingJob) {
        // For updates, use JSON
        const jobData = {
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements,
          keyResponsibilities: formData.keyResponsibilities,
          location: formData.location,
          state: formData.state,
          type: formData.type,
          jobTypeCategory: formData.jobTypeCategory,
          workType: formData.workType,
          industry: formData.industry,
          salaryDisplay: formData.salaryDisplay,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          status: formData.status
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/admin/${editingJob._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(jobData)
        })

        if (response.ok) {
          fetchJobs()
          setShowModal(false)
          resetForm()
        }
      } else {
        // For creation, use FormData
        const formDataObj = new FormData()
        formDataObj.append('title', formData.title)
        formDataObj.append('description', formData.description)
        formDataObj.append('requirements', formData.requirements)
        formDataObj.append('keyResponsibilities', formData.keyResponsibilities)
        formDataObj.append('location', formData.location)
        formDataObj.append('state', formData.state)
        formDataObj.append('type', formData.type)
        formDataObj.append('jobTypeCategory', formData.jobTypeCategory)
        formDataObj.append('workType', formData.workType)
        formDataObj.append('industry', formData.industry)
        formDataObj.append('salaryDisplay', formData.salaryDisplay)
        formDataObj.append('tags', JSON.stringify(formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)))
        formDataObj.append('company.name', formData.companyName)
        formDataObj.append('company.description', formData.companyDescription)
        formDataObj.append('company.website', formData.companyWebsite)
        formDataObj.append('company.size', formData.companySize)
        formDataObj.append('company.founded', formData.companyFounded.toString())
        formDataObj.append('company.industry', JSON.stringify([formData.companyIndustry]))
        formDataObj.append('company.location', formData.companyLocation)
        formDataObj.append('company.contact.email', formData.companyEmail)
        formDataObj.append('company.contact.phone', formData.companyPhone)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`, {
          method: 'POST',
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
      }
    } catch (error) {
      console.error('Error saving job:', error)
    }
  }

  const handleEdit = (job: Job) => {
    setEditingJob(job)
    setFormData({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      keyResponsibilities: job.keyResponsibilities,
      location: job.location,
      state: job.state,
      type: job.type,
      jobTypeCategory: job.jobTypeCategory,
      workType: job.workType,
      industry: job.industry,
      salaryDisplay: job.salaryDisplay,
      tags: job.tags.join(', '),
      status: job.status,
      companyName: job.company.name,
      companyDescription: job.company.description,
      companyWebsite: job.company.website,
      companySize: job.company.size,
      companyFounded: job.company.founded,
      companyIndustry: job.company.industry[0] || 'technology',
      companyLocation: job.company.location,
      companyEmail: job.company.contact.email,
      companyPhone: job.company.contact.phone
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
      state: 'NSW',
      type: 'Full Time',
      jobTypeCategory: 'Permanent',
      workType: 'On-Site',
      industry: 'technology',
      salaryDisplay: '',
      tags: '',
      status: 'active',
      companyName: '',
      companyDescription: '',
      companyWebsite: '',
      companySize: '1-10',
      companyFounded: new Date().getFullYear(),
      companyIndustry: 'technology',
      companyLocation: '',
      companyEmail: '',
      companyPhone: ''
    })
    setEditingJob(null)
  }

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Search */}
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

      {/* Jobs Table */}
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
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No jobs found</td>
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
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{job.company.name}</td>
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
                          : job.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {editingJob ? 'Edit Job' : 'Add New Job'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Job Details */}
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
                        onChange={(e) => setFormData({...formData, industry: e.target.value})}
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

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Requirements
                      </label>
                      <textarea
                        rows={3}
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
                        value={formData.keyResponsibilities}
                        onChange={(e) => setFormData({...formData, keyResponsibilities: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Location & Job Type */}
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
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, jobTypeCategory: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, workType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="On-Site">On-Site</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

                {/* Company Details */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Company Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        required
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company Size
                      </label>
                      <select
                        value={formData.companySize}
                        onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="1-10">1-10</option>
                        <option value="11-50">11-50</option>
                        <option value="51-100">51-100</option>
                        <option value="101-500">101-500</option>
                        <option value="500+">500+</option>
                      </select>
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
                        onChange={(e) => setFormData({...formData, companyFounded: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company Industry
                      </label>
                      <select
                        value={formData.companyIndustry}
                        onChange={(e) => setFormData({...formData, companyIndustry: e.target.value})}
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                    <option value="expired">Expired</option>
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