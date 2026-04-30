import { Suspense } from 'react'
import DashboardContent from './DashboardContent'

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#F5A623] border-t-transparent"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
