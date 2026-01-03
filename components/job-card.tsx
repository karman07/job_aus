'use client'

import { MapPin, DollarSign, Clock, Building2, Users } from 'lucide-react'

interface Job {
  _id: string
  title: string
  company: string
  location: string
  type: string
  salary: {
    min: number
    max: number
    currency: string
  }
  description: string
  requirements: string[]
  benefits: string[]
  createdAt: string
}

interface JobCardProps {
  job: Job
  onClick: (job: Job) => void
}

export function JobCard({ job, onClick }: JobCardProps) {
  return (
    <div 
      onClick={() => onClick(job)}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {job.title}
          </h3>
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
            <Building2 className="h-4 w-4 mr-2" />
            <span className="text-sm">{job.company}</span>
          </div>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {job.type}
        </span>
      </div>

      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
        <MapPin className="h-4 w-4 mr-2" />
        <span className="text-sm">{job.location}</span>
      </div>

      <div className="flex items-center text-green-600 dark:text-green-400 mb-4">
        <DollarSign className="h-4 w-4 mr-2" />
        <span className="text-sm font-medium">
          {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
        </span>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-xs">
            {new Date(job.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <Users className="h-4 w-4 mr-1" />
          <span className="text-xs">{job.requirements.length} requirements</span>
        </div>
      </div>
    </div>
  )
}