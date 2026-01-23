'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '../../components/dashboard/sidebar'
import { DashboardOverview } from '../../components/dashboard/overview'
import { JobsManagement } from '../../components/dashboard/jobs-management'
import { ApplicationsManagement } from '../../components/dashboard/applications-management'
import { UsersManagement } from '../../components/dashboard/users-management'
import { AdminManagement } from '../../components/dashboard/admin-management'
import { CompanyManagement } from '../../components/dashboard/company-management'

interface AnalyticsData {
  jobs: any[]
  applications: any[]
  candidates: any[]
  companies: any[]
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
    companies: [],
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
      // Load all analytics data on login
      loadAllAnalyticsData()
    } catch (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }
  }, [router])

  const loadAllAnalyticsData = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const [jobsRes, applicationsRes, candidatesRes, companiesRes, adminsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/jobs`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/applications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/candidates`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/companies`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/admins`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      const jobs = jobsRes.ok ? await jobsRes.json() : { data: [] }
      const applications = applicationsRes.ok ? await applicationsRes.json() : { data: [] }
      const candidates = candidatesRes.ok ? await candidatesRes.json() : { data: [] }
      const companies = companiesRes.ok ? await companiesRes.json() : { data: [] }
      const admins = adminsRes.ok ? await adminsRes.json() : { data: [] }

      setAnalyticsData({
        jobs: Array.isArray(jobs.data) ? jobs.data : [],
        applications: Array.isArray(applications.data) ? applications.data : [],
        candidates: Array.isArray(candidates.data) ? candidates.data : [],
        companies: Array.isArray(companies.data) ? companies.data : [],
        admins: Array.isArray(admins.data) ? admins.data : [],
        lastUpdated: Date.now()
      })
    } catch (error) {
      console.error('Error loading analytics data:', error)
    }
  }

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
      case 'companies':
        return <CompanyManagement onDataUpdate={(data) => updateAnalyticsData('companies', data)} />
      case 'admins':
        return <AdminManagement onDataUpdate={(data) => updateAnalyticsData('admins', data)} />
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