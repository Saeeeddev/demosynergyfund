// [§9.20] Shape-matched skeleton for Sell page: stepper → 3 boxes (right) + review box (left)
import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="p-4 lg:p-5 flex flex-col gap-4">
      {/* Stepper skeleton */}
      <Skeleton className="h-12 rounded-card" />
      {/* Grid: 3 boxes + review box */}
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-5">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Skeleton className="h-36 rounded-card" />
          <Skeleton className="h-52 rounded-card" />
          <Skeleton className="h-40 rounded-card" />
        </div>
        <Skeleton className="h-96 rounded-card" />
      </div>
    </div>
  )
}
