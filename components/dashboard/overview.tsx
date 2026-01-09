'use client'

import { useState, useEffect } from 'react'
import { Users, Briefcase, FileText, TrendingUp, Calendar, CheckCircle, XCircle, Clock, BarChart3, PieChart } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, Pie } from 'recharts'

interface AnalyticsData {
  jobs: any[]
  applications: any[]
  candidates: any[]
  admins: any[]
  lastUpdated: number
}

interface DashboardOverviewProps {
  analyticsData: AnalyticsData
}

export function DashboardOverview({ analyticsData }: DashboardOverviewProps) {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalCandidates: 0,
    totalApplications: 0,
    pendingApplications: 0,
    interviewApplications: 0,
    hiredApplications: 0,
    rejectedApplications: 0,
    jobsByIndustry: {} as Record<string, number>,
    applicationsByMonth: [] as Array<{ month: string; count: number }>
  })

  useEffect(() => {
    calculateStats()
  }, [analyticsData])

  const calculateStats = () => {
    const { jobs, applications, candidates } = analyticsData
    
    // Job statistics
    const totalJobs = jobs.length
    const activeJobs = jobs.filter(job => job.status === 'Active').length
    
    // Application statistics
    const totalApplications = applications.length
    const pendingApplications = applications.filter(app => app.status === 'Pending').length
    const interviewApplications = applications.filter(app => app.status === 'Interview').length
    const hiredApplications = applications.filter(app => app.status === 'Hired').length
    const rejectedApplications = applications.filter(app => app.status === 'Rejected').length
    
    // Jobs by industry
    const jobsByIndustry = jobs.reduce((acc, job) => {
      const industry = job.industry || 'Other'
      acc[industry] = (acc[industry] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    // Applications by month (last 6 months)
    const applicationsByMonth = getApplicationsByMonth(applications)
    
    setStats({
      totalJobs,
      activeJobs,
      totalCandidates: candidates.length,
      totalApplications,
      pendingApplications,
      interviewApplications,
      hiredApplications,
      rejectedApplications,
      jobsByIndustry,
      applicationsByMonth
    })
  }

  const getApplicationsByMonth = (applications: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const now = new Date()
    const last6Months = []
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthName = months[date.getMonth()]
      
      const count = applications.filter(app => {
        const appDate = new Date(app.appliedAt || app.createdAt)
        const appMonthKey = `${appDate.getFullYear()}-${String(appDate.getMonth() + 1).padStart(2, '0')}`
        return appMonthKey === monthKey
      }).length
      
      last6Months.push({ month: monthName, count })
    }
    
    return last6Months
  }

  const statCards = [
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      subtitle: `${stats.activeJobs} active`,
      icon: Briefcase,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      subtitle: `${stats.pendingApplications} pending`,
      icon: FileText,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Total Candidates',
      value: stats.totalCandidates,
      subtitle: 'Registered',
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Hired',
      value: stats.hiredApplications,
      subtitle: 'Successful hires',
      icon: CheckCircle,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    }
  ]

  const applicationStatusData = [
    { name: 'Pending', value: stats.pendingApplications, color: '#f59e0b' },
    { name: 'Interview', value: stats.interviewApplications, color: '#3b82f6' },
    { name: 'Hired', value: stats.hiredApplications, color: '#10b981' },
    { name: 'Rejected', value: stats.rejectedApplications, color: '#ef4444' }
  ].filter(item => item.value > 0)

  const industryData = Object.entries(stats.jobsByIndustry).map(([industry, count]) => ({
    name: industry.charAt(0).toUpperCase() + industry.slice(1),
    value: count,
    color: getIndustryColor(industry)
  }))

  function getIndustryColor(industry: string): string {
    const colors: Record<string, string> = {
      technology: '#3b82f6',
      health: '#10b981',
      hospitality: '#f59e0b',
      childcare: '#ec4899',
      construction: '#f97316',
      mining: '#6b7280'
    }
    return colors[industry.toLowerCase()] || '#6b7280'
  }

  const hasData = analyticsData.lastUpdated > 0

  if (!hasData) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Welcome to Dashboard</h3>
              <p className="text-blue-700 dark:text-blue-300">Navigate to Jobs, Applications, or Candidates to see analytics data</p>
            </div>
          </div>
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.subtitle}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-blue-600" />
            Application Status Distribution
          </h3>
          {applicationStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={applicationStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {applicationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              No application data available
            </div>
          )}
        </div>

        {/* Jobs by Industry Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
            Jobs by Industry
          </h3>
          {industryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={industryData}>
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
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              No industry data available
            </div>
          )}
        </div>
      </div>

      {/* Applications Trend */}
      {stats.applicationsByMonth.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
            Applications Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.applicationsByMonth}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

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
            <span className="font-medium">Manage Candidates</span>
          </button>
        </div>
      </div>
    </div>
  )
}