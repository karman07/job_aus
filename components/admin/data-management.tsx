'use client'

import { useState, useEffect } from 'react'
import { Database, MapPin, Briefcase, Wrench } from 'lucide-react'

interface DataState {
  industries: string[]
  states: string[]
  jobTypes: string[]
  skills: Record<string, string[]>
}

export function DataManagement() {
  const [data, setData] = useState<DataState>({
    industries: [],
    states: [],
    jobTypes: [],
    skills: {}
  })
  const [loading, setLoading] = useState(true)
  const [selectedIndustry, setSelectedIndustry] = useState('')

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('token')
      const [industriesRes, statesRes, jobTypesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/data/industries`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/data/states`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/data/job-types`)
      ])

      if (industriesRes.ok && statesRes.ok && jobTypesRes.ok) {
        const [industriesData, statesData, jobTypesData] = await Promise.all([
          industriesRes.json(),
          statesRes.json(),
          jobTypesRes.json()
        ])

        setData({
          industries: industriesData.data?.industries || [],
          states: statesData.data?.states || [],
          jobTypes: jobTypesData.data?.jobTypes || [],
          skills: {}
        })

        // Fetch skills for each industry
        const skillsData: Record<string, string[]> = {}
        for (const industry of industriesData.data?.industries || []) {
          try {
            const skillsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/data/skills/${industry}`)
            if (skillsRes.ok) {
              const skillsJson = await skillsRes.json()
              skillsData[industry] = skillsJson.data?.skills || []
            }
          } catch (error) {
            console.error(`Error fetching skills for ${industry}:`, error)
          }
        }
        
        setData(prev => ({ ...prev, skills: skillsData }))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const dataCategories = [
    {
      id: 'industries',
      title: 'Industries',
      description: 'Available job industries on the platform',
      icon: Briefcase,
      color: 'text-blue-600',
      data: data.industries
    },
    {
      id: 'states',
      title: 'Australian States',
      description: 'States and territories available for job locations',
      icon: MapPin,
      color: 'text-green-600',
      data: data.states
    },
    {
      id: 'jobTypes',
      title: 'Job Types',
      description: 'Available job type categories',
      icon: Briefcase,
      color: 'text-purple-600',
      data: data.jobTypes
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Management</h2>
      
      {loading ? (
        <div className="text-center py-8">Loading platform data...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataCategories.map((category) => {
              const Icon = category.icon
              return (
                <div key={category.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <div className="flex items-center mb-4">
                    <Icon className={`h-8 w-8 ${category.color} mr-3`} />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Items:</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{category.data.length}</span>
                    </div>
                    
                    <div className="max-h-32 overflow-y-auto">
                      <div className="flex flex-wrap gap-1">
                        {category.data.map((item, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <Wrench className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Skills by Industry</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">View skills available for each industry</p>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Industry:
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Choose an industry...</option>
                {data.industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry.charAt(0).toUpperCase() + industry.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedIndustry && data.skills[selectedIndustry] && (
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  Skills for {selectedIndustry.charAt(0).toUpperCase() + selectedIndustry.slice(1)} Industry
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.skills[selectedIndustry].map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                {data.skills[selectedIndustry].length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No skills data available for this industry.</p>
                )}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <Database className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Platform Statistics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overview of platform data</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{data.industries.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Industries</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{data.states.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">States/Territories</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{data.jobTypes.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Job Types</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Object.values(data.skills).reduce((total, skills) => total + skills.length, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Skills</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">API Endpoints</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="font-mono">GET /api/data/industries</span>
                <span className="text-green-600 font-medium">Available</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="font-mono">GET /api/data/states</span>
                <span className="text-green-600 font-medium">Available</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="font-mono">GET /api/data/job-types</span>
                <span className="text-green-600 font-medium">Available</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="font-mono">GET /api/data/skills/{'{industry}'}</span>
                <span className="text-green-600 font-medium">Available</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}