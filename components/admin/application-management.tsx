'use client'

import { useState, useEffect } from 'react'
import { Search, Eye, Edit, Trash2, Download } from 'lucide-react'

interface Application {
  _id: string
  candidateId: string
  jobId: string
  fullName: string
  email: string
  phone: string
  location: string
  preferredRole?: string
  currentRole: string
  currentCompany?: string
  yearsExperience: string
  skills?: string
  education?: string
  resumeUrl: string
  customFields?: Array<{
    fieldName: string
    fieldValue: string
  }>
  appliedAt: string
  status: 'Pending' | 'Reviewed' | 'Interview' | 'Rejected' | 'Hired'
  createdAt: string
  updatedAt: string
}

export function ApplicationManagement() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applications/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setApplications(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (applicationId: string, newStatus: Application['status']) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (response.ok) {
        fetchApplications()
      }
    } catch (error) {
      console.error('Error updating application status:', error)
    }
  }

  const handleDelete = async (applicationId: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applications/${applicationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        fetchApplications()
      }
    } catch (error) {
      console.error('Error deleting application:', error)
    }
  }

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application)
    setShowModal(true)
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.currentRole.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Reviewed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Interview': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'Hired': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Application Management</h2>
      </div>

      <div className="flex items-center space-x-4">
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
          <option value="Rejected">Rejected</option>
          <option value="Hired">Hired</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Applied</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No applications found</td>
                </tr>
              ) : (
                filteredApplications.map((application) => (
                  <tr key={application._id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{application.fullName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{application.email}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{application.phone}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{application.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{application.currentRole}</div>
                        {application.currentCompany && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">{application.currentCompany}</div>
                        )}
                        <div className="text-sm text-gray-500 dark:text-gray-400">{application.yearsExperience} years</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={application.status}
                        onChange={(e) => handleStatusUpdate(application._id, e.target.value as Application['status'])}
                        className={`text-xs font-semibold rounded-full px-2 py-1 ${getStatusColor(application.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Interview">Interview</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Hired">Hired</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewDetails(application)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {application.resumeUrl && (
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}${application.resumeUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900 dark:text-green-400"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(application._id)}
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

      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Application Details
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.location}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Role</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.currentRole}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Years Experience</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.yearsExperience}</p>
                </div>
              </div>
              
              {selectedApplication.currentCompany && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Company</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.currentCompany}</p>
                </div>
              )}
              
              {selectedApplication.skills && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.skills}</p>
                </div>
              )}
              
              {selectedApplication.education && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Education</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.education}</p>
                </div>
              )}
              
              {selectedApplication.customFields && selectedApplication.customFields.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Custom Fields</label>
                  <div className="space-y-2">
                    {selectedApplication.customFields.map((field, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{field.fieldName}:</p>
                        <p className="text-sm text-gray-900 dark:text-white">{field.fieldValue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedApplication.status)}`}>
                  {selectedApplication.status}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Applied Date</label>
                <p className="text-sm text-gray-900 dark:text-white">{new Date(selectedApplication.appliedAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              {selectedApplication.resumeUrl && (
                <a
                  href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}${selectedApplication.resumeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Resume</span>
                </a>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}