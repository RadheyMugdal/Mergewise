import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { GitPullRequest, GitBranch, CheckCircle2, Clock, AlertCircle, Loader2, type LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  description?: string
  variant?: "default" | "success" | "warning" | "info"
  trend?: {
    value: number
    isPositive: boolean
  }
}

const variantStyles = {
  default: "text-muted-foreground",
  success: "text-green-500",
  warning: "text-yellow-500",
  info: "text-blue-500"
}

export function StatCard({ title, value, icon: Icon, description, variant = "default", trend }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn("h-4 w-4", variantStyles[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <p className={cn("text-xs mt-1", trend.isPositive ? "text-green-500" : "text-red-500")}>
            {trend.isPositive ? "+" : ""}{trend.value} from last month
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface StatsGridProps {
  stats: {
    totalRepositories: number
    totalReviews: number
    pendingReviews: number
    completedReviews: number
    runningReviews: number
    failedReviews: number
  }
  isLoading?: boolean
}

export function StatsGrid({ stats, isLoading }: StatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Repositories"
        value={stats?.totalRepositories ?? 0}
        icon={GitBranch}
        description="Connected repositories"
        variant="default"
      />
      <StatCard
        title="Total Reviews"
        value={stats?.totalReviews ?? 0}
        icon={GitPullRequest}
        description="All time PR reviews"
        variant="info"
      />
      <StatCard
        title="Completed"
        value={stats?.completedReviews ?? 0}
        icon={CheckCircle2}
        description="Successfully reviewed"
        variant="success"
      />
      <StatCard
        title="Pending"
        value={(stats?.pendingReviews ?? 0) + (stats?.runningReviews ?? 0)}
        icon={Clock}
        description={`${stats?.pendingReviews ?? 0} pending, ${stats?.runningReviews ?? 0} running`}
        variant="warning"
      />
    </div>
  )
}
