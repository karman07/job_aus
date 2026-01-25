'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { Pagination } from '../pagination'

interface ICompany {
  _id: string
  userId: string
  name?: string
  description?: string
  website?: string
  logo?: string
  size?: string
  founded?: number
  industry?: ('health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology')[]
  location?: string
  state?: string
  contact?: {
    email?: string
    phone?: string
  }
  isVerified?: boolean
}

interface IJob {
  _id: string
  title: string
  description?: string
  requirements?: string
  keyResponsibilities?: string
  contentFile?: string
  location: string
  state: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT'
  type: 'Full Time' | 'Part Time' | 'Contract' | 'FIFO 2:1' | 'FIFO 8:6'
  jobTypeCategory: 'Permanent' | 'Contract' | 'Apprenticeship' | 'Trainee'
  workType: 'On-Site' | 'Remote' | 'Hybrid'
  industry: 'health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology'
  salaryDisplay?: string
  salaryMin?: number
  salaryMax?: number
  tags: string[]
  status: 'active' | 'inactive' | 'closed'
  sponsorshipAvailable?: boolean
  company?: {
    name?: string
    description?: string
    website?: string
    logo?: string
    size?: string
    founded?: number
    industry?: ('health' | 'hospitality' | 'childcare' | 'construction' | 'mining' | 'technology')[]
    location?: string
    contact?: {
      email?: string
      phone?: string
    }
  }
  postedBy?: string | {
    _id: string
    email: string
    firstName: string
    lastName: string
  }
  applicantCount: number
  customFields?: Array<{
    label: string
    value: string
  }>
  createdAt: Date
  updatedAt: Date
}

interface JobsManagementProps {
  onDataUpdate?: (data: IJob[]) => void
}

export function JobsManagement({ onDataUpdate }: JobsManagementProps) {
  const [userCompanyMap, setUserCompanyMap] = useState<{[key: string]: ICompany}>({})
  const [companyMap, setCompanyMap] = useState<{[key: string]: ICompany}>({})
  const [companies, setCompanies] = useState<ICompany[]>([])
  const [jobs, setJobs] = useState<IJob[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingJob, setEditingJob] = useState<IJob | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [formData, setFormData] = useState({
    companyId: '',
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
    sponsorshipAvailable: false
  })

  useEffect(() => {
    fetchJobs()
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const companiesData = data.data?.companies || []
        setCompanies(companiesData)
        
        // Create company maps for quick lookup
        const userMap: {[key: string]: ICompany} = {}
        const companyIdMap: {[key: string]: ICompany} = {}
        companiesData.forEach((company: ICompany) => {
          userMap[company.userId] = company
          companyIdMap[company._id] = company
        })
        setUserCompanyMap(userMap)
        setCompanyMap(companyIdMap)
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
    }
  }

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setJobs([])
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/jobs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const jobsData = data.data?.jobs || []
        setJobs(jobsData)
        onDataUpdate?.(jobsData)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    
    const selectedCompany = companies.find(c => c._id === formData.companyId)
    const jobData = {
      ...(selectedCompany?.userId && { postedBy: selectedCompany.userId }),
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
      salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
      salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      status: formData.status,
      sponsorshipAvailable: formData.sponsorshipAvailable
    }

    try {
      const url = editingJob 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/${editingJob._id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`
      
      const response = await fetch(url, {
        method: editingJob ? 'PUT' : 'POST',
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
    } catch (error) {
      console.error('Error saving job:', error)
    }
  }

  const handleEdit = (job: IJob) => {
    setEditingJob(job)
    const postedById = typeof job.postedBy === 'string' ? job.postedBy : job.postedBy?._id || ''
    const selectedCompany = companies.find(c => c.userId === postedById)
    setFormData({
      companyId: selectedCompany?._id || '',
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
      sponsorshipAvailable: job.sponsorshipAvailable || false
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      companyId: '',
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
      sponsorshipAvailable: false
    })
    setEditingJob(null)
  }

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/${jobId}`, {
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

  const filteredJobs = Array.isArray(jobs) ? jobs.filter(job => {
    const postedById = typeof job.postedBy === 'string' ? job.postedBy : job.postedBy?._id || ''
    const company = userCompanyMap[postedById]
    
    // Always show jobs, only filter by search term if provided
    if (!searchTerm.trim()) return true
    
    const matchesSearch = (
      (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    return matchesSearch
  }) : []

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalFilteredPages = Math.max(1, Math.ceil(filteredJobs.length / itemsPerPage))

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
                paginatedJobs.map((job) => (
                  <tr key={job._id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{job.title || 'Untitled'}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{job.location || 'Unknown'}, {job.state || 'Unknown'} • {job.type || 'Unknown'}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{job.industry || 'Unknown'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-300">
                              {(() => {
                                const postedById = typeof job.postedBy === 'string' ? job.postedBy : job.postedBy?._id || ''
                                return userCompanyMap[postedById]?.name?.charAt(0) || 'C'
                              })()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {(() => {
                              const postedById = typeof job.postedBy === 'string' ? job.postedBy : job.postedBy?._id || ''
                              return userCompanyMap[postedById]?.name || 'No Company'
                            })()}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {(() => {
                              const postedById = typeof job.postedBy === 'string' ? job.postedBy : job.postedBy?._id || ''
                              return userCompanyMap[postedById]?.location || 'Unknown location'
                            })()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {job.salaryDisplay || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {job.applicantCount ?? 0}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        job.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : job.status === 'inactive'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {job.status || 'unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => handleEdit(job)}
                          className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </button>
                      </div>
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
        totalPages={totalFilteredPages}
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
                      Company
                    </label>
                    <select
                      value={formData.companyId}
                      onChange={(e) => setFormData({...formData, companyId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="">Select Company</option>
                      {companies.map(company => (
                        <option key={company._id} value={company._id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      Min Salary
                    </label>
                    <input
                      type="number"
                      value={formData.salaryMin}
                      onChange={(e) => setFormData({...formData, salaryMin: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Max Salary
                    </label>
                    <input
                      type="number"
                      value={formData.salaryMax}
                      onChange={(e) => setFormData({...formData, salaryMax: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
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

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.sponsorshipAvailable}
                      onChange={(e) => setFormData({...formData, sponsorshipAvailable: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Sponsorship Available</span>
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