'use client'

import { useState, useEffect } from 'react'
import { Users, Briefcase, FileText, TrendingUp, Calendar, CheckCircle, XCircle, Clock, BarChart3, PieChart } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, Pie } from 'recharts'

interface Stats {
  totalJobs: number
  totalApplications: number
  totalUsers: number
  pendingApplications: number
  approvedApplications: number
  rejectedApplications: number
  activeJobs: number
  inactiveJobs: number
}

export function DashboardOverview() {
  const [stats, setStats] = useState<Stats>({
    totalJobs: 0,
    totalApplications: 0,
    totalUsers: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    activeJobs: 0,
    inactiveJobs: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Fetch jobs
      const jobsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      // Fetch applications
      const applicationsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      // Fetch users
      const usersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (jobsResponse.ok && applicationsResponse.ok && usersResponse.ok) {
        const jobsData = await jobsResponse.json()
        const applicationsData = await applicationsResponse.json()
        const usersData = await usersResponse.json()

        const jobs = jobsData.jobs || []
        const applications = applicationsData.applications || []
        const users = usersData.users || []

        setStats({
          totalJobs: jobs.length,
          totalApplications: applications.length,
          totalUsers: users.length,
          pendingApplications: applications.filter((app: any) => app.status === 'pending').length,
          approvedApplications: applications.filter((app: any) => app.status === 'approved').length,
          rejectedApplications: applications.filter((app: any) => app.status === 'rejected').length,
          activeJobs: jobs.filter((job: any) => job.status === 'active').length,
          inactiveJobs: jobs.filter((job: any) => job.status === 'inactive').length,
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      icon: Briefcase,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: FileText,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Pending Applications',
      value: stats.pendingApplications,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    }
  ]

  const applicationStats = [
    {
      title: 'Approved',
      value: stats.approvedApplications,
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Rejected',
      value: stats.rejectedApplications,
      icon: XCircle,
      color: 'text-red-600 dark:text-red-400'
    },
    {
      title: 'Pending',
      value: stats.pendingApplications,
      icon: Clock,
      color: 'text-yellow-600 dark:text-yellow-400'
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4 mr-2" />
          {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center">
                <div className={`${stat.bgColor} p-4 rounded-xl shadow-sm`}>
                  <Icon className={`h-7 w-7 ${stat.textColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-blue-600" />
            Application Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={[
                  { name: 'Pending', value: stats.pendingApplications, color: '#f59e0b' },
                  { name: 'Approved', value: stats.approvedApplications, color: '#10b981' },
                  { name: 'Rejected', value: stats.rejectedApplications, color: '#ef4444' }
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {[
                  { name: 'Pending', value: stats.pendingApplications, color: '#f59e0b' },
                  { name: 'Approved', value: stats.approvedApplications, color: '#10b981' },
                  { name: 'Rejected', value: stats.rejectedApplications, color: '#ef4444' }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Job Status Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
            Job Status Overview
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                { name: 'Active Jobs', value: stats.activeJobs, color: '#10b981' },
                { name: 'Inactive Jobs', value: stats.inactiveJobs, color: '#ef4444' }
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {[
                  { name: 'Active Jobs', value: stats.activeJobs, color: '#10b981' },
                  { name: 'Inactive Jobs', value: stats.inactiveJobs, color: '#ef4444' }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
            <Briefcase className="h-5 w-5 mr-2" />
            <span className="font-medium">Create New Job</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg">
            <FileText className="h-5 w-5 mr-2" />
            <span className="font-medium">Review Applications</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg">
            <Users className="h-5 w-5 mr-2" />
            <span className="font-medium">Manage Users</span>
          </button>
        </div>
      </div>
    </div>
  )
}