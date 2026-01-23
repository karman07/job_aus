'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Building, CheckCircle, XCircle } from 'lucide-react'
import { Pagination } from '../pagination'

interface Company {
  _id: string
  userId: string
  name: string
  description?: string
  website?: string
  logo?: string
  size?: string
  founded?: number
  industry: string[]
  location: string
  state: string
  contact: {
    email: string
    phone?: string
  }
  isVerified: boolean
  createdAt: string
}

interface CompanyManagementProps {
  onDataUpdate?: (data: Company[]) => void
}

export function CompanyManagement({ onDataUpdate }: CompanyManagementProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.error('No token found')
        setCompanies([])
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const companiesData = Array.isArray(data.data?.companies) ? data.data.companies : Array.isArray(data.data) ? data.data : []
        setCompanies(companiesData)
        setTotalPages(Math.ceil(companiesData.length / itemsPerPage))
        onDataUpdate?.(companiesData)
      } else {
        console.error('API Error:', response.status, await response.text())
        setCompanies([])
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (companyId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/companies/${companyId}/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        fetchCompanies()
      } else {
        console.error('Verify error:', response.status, await response.text())
      }
    } catch (error) {
      console.error('Error verifying company:', error)
    }
  }

  const handleDelete = async (companyId: string) => {
    if (!confirm('Are you sure you want to delete this company?')) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/companies/${companyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        fetchCompanies()
      } else {
        console.error('Delete error:', response.status, await response.text())
      }
    } catch (error) {
      console.error('Error deleting company:', error)
    }
  }

  const filteredCompanies = Array.isArray(companies) ? companies.filter(company =>
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.contact?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  // Client-side pagination
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + itemsPerPage)
  const totalFilteredPages = Math.ceil(filteredCompanies.length / itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Company Management</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total: {companies.length} companies
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies..."
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
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Industry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
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
              ) : paginatedCompanies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No companies found</td>
                </tr>
              ) : (
                paginatedCompanies.map((company) => (
                  <tr key={company._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full mr-3">
                          <Building className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {company.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {company.contact?.email}
                          </div>
                          {company.website && (
                            <div className="text-sm text-blue-600 dark:text-blue-400">
                              <a href={company.website} target="_blank" rel="noopener noreferrer">
                                {company.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {company.location}, {company.state}
                      </div>
                      {company.size && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {company.size} employees
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {company.industry?.map((ind, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                          >
                            {ind}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        company.isVerified 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {company.isVerified ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Unverified
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {!company.isVerified && (
                          <button
                            onClick={() => handleVerify(company._id)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400"
                            title="Verify Company"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(company._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400"
                          title="Delete Company"
                        >
                          <Trash2 className="h-4 w-4" />
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
    </div>
  )
}