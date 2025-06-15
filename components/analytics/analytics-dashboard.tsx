'use client'

import { styled } from '@/styled-system/jsx'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

// Mock data for analytics - will be replaced with real data later
const brandMetrics = [
  { name: 'Jan', brands: 2, jobs: 8 },
  { name: 'Feb', brands: 5, jobs: 15 },
  { name: 'Mar', brands: 3, jobs: 12 },
  { name: 'Apr', brands: 8, jobs: 25 },
  { name: 'May', brands: 6, jobs: 18 },
  { name: 'Jun', brands: 4, jobs: 14 },
]

const jobStatusData = [
  { name: 'Completed', value: 45, color: '#10b981' },
  { name: 'Processing', value: 15, color: '#3b82f6' },
  { name: 'Pending', value: 25, color: '#f59e0b' },
  { name: 'Failed', value: 15, color: '#ef4444' },
]

interface AnalyticsDashboardProps {
  brandCount?: number
  totalJobs?: number
  completedJobs?: number
  activeJobs?: number
}

export function AnalyticsDashboard({
  brandCount = 0,
  totalJobs = 0,
  completedJobs = 0,
  activeJobs = 0,
}: AnalyticsDashboardProps) {
  const stats = [
    {
      name: 'Total Brands',
      value: brandCount,
      change: '+12%',
      changeType: 'positive' as const,
      icon: '🏷️',
    },
    {
      name: 'Total Jobs',
      value: totalJobs,
      change: '+8%',
      changeType: 'positive' as const,
      icon: '⚡',
    },
    {
      name: 'Completed Jobs',
      value: completedJobs,
      change: '+23%',
      changeType: 'positive' as const,
      icon: '✅',
    },
    {
      name: 'Active Jobs',
      value: activeJobs,
      change: '-5%',
      changeType: 'negative' as const,
      icon: '🔄',
    },
  ]

  return (
    <styled.div>
      {/* Stats Grid */}
      <styled.div
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gap={6}
        mb={8}
      >
        {stats.map((stat) => (
          <styled.div
            key={stat.name}
            bg="white"
            p={6}
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
            _hover={{ shadow: 'sm' }}
            transition="all 0.2s"
          >
            <styled.div
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={4}
            >
              <styled.div
                fontSize="2xl"
                width="12"
                height="12"
                bg="gray.50"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {stat.icon}
              </styled.div>
              <styled.div
                fontSize="sm"
                fontWeight="medium"
                color={stat.changeType === 'positive' ? 'green.600' : 'red.600'}
              >
                {stat.change}
              </styled.div>
            </styled.div>
            <styled.div>
              <styled.div fontSize="2xl" fontWeight="bold" color="gray.900" mb={1}>
                {stat.value.toLocaleString()}
              </styled.div>
              <styled.div fontSize="sm" color="gray.600">
                {stat.name}
              </styled.div>
            </styled.div>
          </styled.div>
        ))}
      </styled.div>

      {/* Charts Grid */}
      <styled.div
        display="grid"
        gridTemplateColumns={{ base: '1fr', lg: '2fr 1fr' }}
        gap={6}
      >
        {/* Activity Chart */}
        <styled.div
          bg="white"
          p={6}
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
        >
          <styled.h3 fontSize="lg" fontWeight="semibold" color="gray.900" mb={4}>
            Activity Overview
          </styled.h3>
          <styled.div height="300px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brandMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="brands" fill="#3b82f6" name="Brands Created" />
                <Bar dataKey="jobs" fill="#10b981" name="Jobs Completed" />
              </BarChart>
            </ResponsiveContainer>
          </styled.div>
        </styled.div>

        {/* Job Status Distribution */}
        <styled.div
          bg="white"
          p={6}
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
        >
          <styled.h3 fontSize="lg" fontWeight="semibold" color="gray.900" mb={4}>
            Job Status
          </styled.h3>
          <styled.div height="300px">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={jobStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {jobStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </styled.div>

          {/* Legend */}
          <styled.div display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} mt={4}>
            {jobStatusData.map((item) => (
              <styled.div key={item.name} display="flex" alignItems="center" gap={2}>
                <styled.div width="3" height="3" borderRadius="full" bg={item.color} />
                <styled.span fontSize="sm" color="gray.600">
                  {item.name}
                </styled.span>
              </styled.div>
            ))}
          </styled.div>
        </styled.div>
      </styled.div>

      {/* Recent Activity */}
      <styled.div
        bg="white"
        borderRadius="lg"
        border="1px solid"
        borderColor="gray.200"
        mt={6}
      >
        <styled.div p={6} borderBottom="1px solid" borderColor="gray.200">
          <styled.h3 fontSize="lg" fontWeight="semibold" color="gray.900">
            Recent Activity
          </styled.h3>
        </styled.div>

        <styled.div p={6}>
          <styled.div display="flex" flexDirection="column" gap={4}>
            {[
              { icon: '🏷️', text: 'Created brand "Modern Fitness"', time: '2 hours ago' },
              {
                icon: '⚡',
                text: 'Generated 24 products for TechStyle',
                time: '4 hours ago',
              },
              {
                icon: '📸',
                text: 'Completed image generation for SportsCo',
                time: '6 hours ago',
              },
              { icon: '📊', text: 'Exported catalog for RetailMax', time: '1 day ago' },
            ].map((activity, index) => (
              <styled.div
                key={index}
                display="flex"
                alignItems="center"
                gap={4}
                p={3}
                borderRadius="md"
                _hover={{ bg: 'gray.50' }}
                transition="all 0.2s"
              >
                <styled.div
                  fontSize="lg"
                  width="10"
                  height="10"
                  bg="gray.100"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {activity.icon}
                </styled.div>
                <styled.div flex="1">
                  <styled.div fontSize="sm" color="gray.900">
                    {activity.text}
                  </styled.div>
                  <styled.div fontSize="xs" color="gray.500">
                    {activity.time}
                  </styled.div>
                </styled.div>
              </styled.div>
            ))}
          </styled.div>
        </styled.div>
      </styled.div>
    </styled.div>
  )
}
