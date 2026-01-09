'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '../../components/dashboard/sidebar'
import { DashboardOverview } from '../../components/dashboard/overview'
import { JobsManagement } from '../../components/dashboard/jobs-management'
import { ApplicationsManagement } from '../../components/dashboard/applications-management'
import { UsersManagement } from '../../components/dashboard/users-management'
import { AdminManagement } from '../../components/dashboard/admin-management'
import { DataManagement } from '../../components/dashboard/data-management'

interface AnalyticsData {
  jobs: any[]
  applications: any[]
  candidates: any[]
  admins: any[]
  lastUpdated: number
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState<any>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    jobs: [],
    applications: [],
    candidates: [],
    admins: [],
    lastUpdated: 0
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }
    
    try {
      setUser(JSON.parse(userData))
    } catch (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }
  }, [router])

  const updateAnalyticsData = (type: keyof Omit<AnalyticsData, 'lastUpdated'>, data: any[]) => {
    setAnalyticsData(prev => ({
      ...prev,
      [type]: data,
      lastUpdated: Date.now()
    }))
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview analyticsData={analyticsData} />
      case 'jobs':
        return <JobsManagement onDataUpdate={(data) => updateAnalyticsData('jobs', data)} />
      case 'applications':
        return <ApplicationsManagement onDataUpdate={(data) => updateAnalyticsData('applications', data)} />
      case 'users':
        return <UsersManagement onDataUpdate={(data) => updateAnalyticsData('candidates', data)} />
      case 'admins':
        return <AdminManagement onDataUpdate={(data) => updateAnalyticsData('admins', data)} />
      case 'data':
        return <DataManagement />
      default:
        return <DashboardOverview analyticsData={analyticsData} />
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="lg:ml-64">
        <main className="p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}