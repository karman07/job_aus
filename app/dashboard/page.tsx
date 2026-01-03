'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '../../components/dashboard/sidebar'
import { DashboardOverview } from '../../components/dashboard/overview'
import { JobsManagement } from '../../components/dashboard/jobs-management'
import { ApplicationsManagement } from '../../components/dashboard/applications-management'
import { UsersManagement } from '../../components/dashboard/users-management'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState<any>(null)
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

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />
      case 'jobs':
        return <JobsManagement />
      case 'applications':
        return <ApplicationsManagement />
      case 'users':
        return <UsersManagement />
      default:
        return <DashboardOverview />
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