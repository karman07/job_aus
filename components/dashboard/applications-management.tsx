'use client'

import { useState, useEffect } from 'react'
import { Eye, Search, FileText } from 'lucide-react'
import { Pagination } from '../pagination'

interface Application {
  _id: string
  candidateId: string
  jobId: {
    _id: string
    title: string
    location: string
  }
  fullName: string
  email: string
  phone: string
  location: string
  preferredRole: string
  currentRole: string
  currentCompany: string
  yearsExperience: string
  skills: string
  education: string
  resumeUrl: string
  status: string
  customFields: Array<any>
  appliedAt: string
  createdAt: string
  updatedAt: string
}

interface ApplicationsManagementProps {
  onDataUpdate?: (data: Application[]) => void
}

export function ApplicationsManagement({ onDataUpdate }: ApplicationsManagementProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found')
        setApplications([])
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.status === 401) {
        console.error('Token expired or invalid')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return
      }
      
      if (response.ok) {
        const data = await response.json()
        console.log('Applications API Response:', data) // Debug log
        
        // Force extract applications from any possible structure
        let applicationsData = []
        if (data.data?.applications) {
          applicationsData = data.data.applications
        } else if (data.applications) {
          applicationsData = data.applications
        } else if (Array.isArray(data.data)) {
          applicationsData = data.data
        } else if (Array.isArray(data)) {
          applicationsData = data
        }
        
        console.log('Extracted applications:', applicationsData) // Debug log
        setApplications(applicationsData)
        setTotalPages(Math.ceil(applicationsData.length / itemsPerPage))
        onDataUpdate?.(applicationsData)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  const filteredApplications = Array.isArray(applications) && applications.length > 0 ? applications.filter(app => {
    if (!app) return false // Skip null/undefined items
    
    const matchesSearch = !searchTerm.trim() || (
      (app.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  }) : applications || [] // Return all applications if filtering fails

  // Client-side pagination
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage)
  const totalFilteredPages = Math.ceil(filteredApplications.length / itemsPerPage)
//
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Hired': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Reviewed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Interview': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Applications Management</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total: {applications.length} applications
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Interview">Interview</option>
          <option value="Hired">Hired</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No applications found. Total applications in state: {applications.length}
                  </td>
                </tr>
              ) : paginatedApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No applications match current filters. Total: {applications.length}, Filtered: {filteredApplications.length}
                  </td>
                </tr>
              ) : (
                paginatedApplications.map((application) => (
                  <tr key={application._id || Math.random()}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {application.fullName || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {application.email || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {application.currentRole || 'N/A'} at {application.currentCompany || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Applied for: {application.jobId?.title || 'N/A'} - {application.jobId?.location || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {application.yearsExperience || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status || 'Unknown')}`}>
                        {application.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedApplication(application)
                            setShowModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {application.resumeUrl && (
                          <a
                            href={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}${application.resumeUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-900 dark:text-purple-400"
                            title="View Resume"
                          >
                            <FileText className="h-4 w-4" />
                          </a>
                        )}
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

      {/* Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Application Details
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Experience</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.yearsExperience}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Role</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.currentRole}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.currentCompany}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Applied Job</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.jobId?.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Location</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.jobId?.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Role</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.preferredRole}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Education</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.education}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills</label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.skills}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.location}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Close
              </button>
              {selectedApplication.resumeUrl && (
                <a
                  href={`${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}${selectedApplication.resumeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  View Resume
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}