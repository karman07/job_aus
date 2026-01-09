'use client'

import { useState, useEffect } from 'react'
import { Database, MapPin, Briefcase, Wrench } from 'lucide-react'

interface Industry {
  id: string
  name: string
  description: string
}

interface Location {
  state: string
  cities: string[]
}

interface Skill {
  name: string
  category: string
}

export function DataManagement() {
  const [industries, setIndustries] = useState<Industry[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedIndustry, setSelectedIndustry] = useState('technology')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedIndustry) {
      fetchSkills(selectedIndustry)
    }
  }, [selectedIndustry])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      const industriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/data/industries`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      const locationsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/data/locations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (industriesResponse.ok) {
        const industriesData = await industriesResponse.json()
        setIndustries(industriesData.data?.industries || industriesData.industries || [])
      }

      if (locationsResponse.ok) {
        const locationsData = await locationsResponse.json()
        setLocations(locationsData.data?.locations || locationsData.locations || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSkills = async (industry: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/data/skills?industry=${industry}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setSkills(data.data?.skills || data.skills || [])
      }
    } catch (error) {
      console.error('Error fetching skills:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reference Data</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reference Data Management</h2>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Database className="h-4 w-4 mr-2" />
          System Reference Data
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
              Industries ({industries.length})
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {industries.map((industry, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    selectedIndustry === industry.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedIndustry(industry.id)}
                >
                  <div className="font-medium text-gray-900 dark:text-white capitalize">
                    {industry.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {industry.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-green-600" />
              Locations ({locations.length} states)
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {locations.map((location, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                  <div className="font-medium text-gray-900 dark:text-white mb-2">
                    {location.state}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {location.cities.map((city, cityIndex) => (
                      <span
                        key={cityIndex}
                        className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Wrench className="h-5 w-5 mr-2 text-purple-600" />
              Skills for {selectedIndustry} ({skills.length})
            </h3>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {industries.map((industry, index) => (
                  <option key={index} value={industry.id}>
                    {industry.name.charAt(0).toUpperCase() + industry.name.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No skills found for this industry
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Industries</div>
            <div className="text-2xl font-bold text-blue-600">{industries.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total States</div>
            <div className="text-2xl font-bold text-green-600">{locations.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Skills ({selectedIndustry})</div>
            <div className="text-2xl font-bold text-purple-600">{skills.length}</div>
          </div>
        </div>
      </div>
    </div>
  )
}