"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

export default function AllCategoryPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home page instead of showing Christmas deals
    router.push("/")
  }, [router])

  // Show loading skeleton while redirecting
  return (
    <div className="container py-8">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted mb-4">
          <Skeleton className="w-full h-full rounded-full" />
        </div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
      <div className="text-center text-muted-foreground">Redirecting...</div>
    </div>
  )
}
