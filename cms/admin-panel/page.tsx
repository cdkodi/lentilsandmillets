'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const adminSession = localStorage.getItem('admin_session')
    
    if (adminSession) {
      router.push('/admin-panel/dashboard')
    } else {
      router.push('/admin-panel/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-lg">Redirecting...</div>
    </div>
  )
}