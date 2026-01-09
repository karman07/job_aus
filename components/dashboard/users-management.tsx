'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, User, MapPin, Briefcase } from 'lucide-react'
import { Pagination } from '../pagination'

interface Candidate {
  _id: string
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
  preferredIndustries: string[]
  salaryExpectation: number
  availableFrom: string
  visaStatus: string
  portfolioUrl: string
  linkedinUrl: string
  isOpenToWork: boolean
  createdAt: string
}

interface UsersManagementProps {
  onDataUpdate?: (data: Candidate[]) => void
}

export function UsersManagement({ onDataUpdate }: UsersManagementProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    preferredRole: '',
    currentRole: '',
    currentCompany: '',
    yearsExperience: '0-1',
    skills: '',
    education: '',
    preferredIndustries: 'technology',
    salaryExpectation: 0,
    availableFrom: '',
    visaStatus: 'citizen',
    portfolioUrl: '',
    linkedinUrl: '',
    isOpenToWork: true
  })

  useEffect(() => {
    fetchCandidates()
  }, [currentPage])

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/candidates?page=${currentPage}&limit=${itemsPerPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        const candidatesData = data.data?.candidates || []
        setCandidates(candidatesData)
        setTotalPages(data.data?.pagination?.pages || 1)
        onDataUpdate?.(candidatesData)
      }
    } catch (error) {
      console.error('Error fetching candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    
    const candidateData = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      preferredRole: formData.preferredRole,
      currentRole: formData.currentRole,
      currentCompany: formData.currentCompany,
      yearsExperience: formData.yearsExperience,
      skills: formData.skills,
      education: formData.education,
      preferredIndustries: [formData.preferredIndustries],
      salaryExpectation: formData.salaryExpectation,
      availableFrom: formData.availableFrom,
      visaStatus: formData.visaStatus,
      portfolioUrl: formData.portfolioUrl,
      linkedinUrl: formData.linkedinUrl,
      isOpenToWork: formData.isOpenToWork
    }

    try {
      const url = editingCandidate 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/candidates/${editingCandidate._id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/candidates`
      
      const response = await fetch(url, {
        method: editingCandidate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(candidateData)
      })

      if (response.ok) {
        fetchCandidates()
        setShowModal(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving candidate:', error)
    }
  }

  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate)
    setFormData({
      fullName: candidate.fullName,
      email: candidate.email,
      phone: candidate.phone,
      location: candidate.location,
      preferredRole: candidate.preferredRole,
      currentRole: candidate.currentRole,
      currentCompany: candidate.currentCompany,
      yearsExperience: candidate.yearsExperience,
      skills: candidate.skills,
      education: candidate.education,
      preferredIndustries: candidate.preferredIndustries[0] || 'technology',
      salaryExpectation: candidate.salaryExpectation,
      availableFrom: candidate.availableFrom?.split('T')[0] || '',
      visaStatus: candidate.visaStatus,
      portfolioUrl: candidate.portfolioUrl,
      linkedinUrl: candidate.linkedinUrl,
      isOpenToWork: candidate.isOpenToWork
    })
    setShowModal(true)
  }

  const handleDelete = async (candidateId: string) => {
    if (!confirm('Are you sure you want to delete this candidate?')) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/candidates/${candidateId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        fetchCandidates()
      }
    } catch (error) {
      console.error('Error deleting candidate:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      location: '',
      preferredRole: '',
      currentRole: '',
      currentCompany: '',
      yearsExperience: '0-1',
      skills: '',
      education: '',
      preferredIndustries: 'technology',
      salaryExpectation: 0,
      availableFrom: '',
      visaStatus: 'citizen',
      portfolioUrl: '',
      linkedinUrl: '',
      isOpenToWork: true
    })
    setEditingCandidate(null)
  }

  const filteredCandidates = candidates.filter(candidate =>
    candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.preferredRole.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Candidates Management</h2>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Candidate</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Current Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Salary Expectation
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
              ) : filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No candidates found</td>
                </tr>
              ) : (
                filteredCandidates.map((candidate) => (
                  <tr key={candidate._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full mr-3">
                          <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {candidate.fullName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {candidate.email}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {candidate.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {candidate.currentRole}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {candidate.currentCompany}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {candidate.yearsExperience} years
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      ${candidate.salaryExpectation?.toLocaleString() || 'Not specified'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        candidate.isOpenToWork 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {candidate.isOpenToWork ? 'Open to Work' : 'Not Available'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(candidate)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(candidate._id)}
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
                {editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Professional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Preferred Role
                      </label>
                      <input
                        type="text"
                        value={formData.preferredRole}
                        onChange={(e) => setFormData({...formData, preferredRole: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Role
                      </label>
                      <input
                        type="text"
                        value={formData.currentRole}
                        onChange={(e) => setFormData({...formData, currentRole: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Company
                      </label>
                      <input
                        type="text"
                        value={formData.currentCompany}
                        onChange={(e) => setFormData({...formData, currentCompany: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Years Experience
                      </label>
                      <select
                        value={formData.yearsExperience}
                        onChange={(e) => setFormData({...formData, yearsExperience: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="0-1">0-1 years</option>
                        <option value="1-3">1-3 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Skills
                    </label>
                    <textarea
                      rows={2}
                      value={formData.skills}
                      onChange={(e) => setFormData({...formData, skills: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Education
                    </label>
                    <input
                      type="text"
                      value={formData.education}
                      onChange={(e) => setFormData({...formData, education: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Preferences */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Preferences</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Preferred Industry
                      </label>
                      <select
                        value={formData.preferredIndustries}
                        onChange={(e) => setFormData({...formData, preferredIndustries: e.target.value})}
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
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Salary Expectation
                      </label>
                      <input
                        type="number"
                        value={formData.salaryExpectation}
                        onChange={(e) => setFormData({...formData, salaryExpectation: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Visa Status
                      </label>
                      <select
                        value={formData.visaStatus}
                        onChange={(e) => setFormData({...formData, visaStatus: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="citizen">Citizen</option>
                        <option value="pr">Permanent Resident</option>
                        <option value="visa_holder">Visa Holder</option>
                        <option value="needs_sponsorship">Needs Sponsorship</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Available From
                      </label>
                      <input
                        type="date"
                        value={formData.availableFrom}
                        onChange={(e) => setFormData({...formData, availableFrom: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div className="flex items-center pt-6">
                      <input
                        type="checkbox"
                        id="isOpenToWork"
                        checked={formData.isOpenToWork}
                        onChange={(e) => setFormData({...formData, isOpenToWork: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isOpenToWork" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Open to Work
                      </label>
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Links</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Portfolio URL
                      </label>
                      <input
                        type="url"
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({...formData, portfolioUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
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
                    {editingCandidate ? 'Update' : 'Create'}
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