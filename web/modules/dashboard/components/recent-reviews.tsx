import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { ExternalLink, GitPullRequest } from "lucide-react"
import Link from "next/link"

type ReviewStatus = "pending" | "running" | "completed" | "failed"

interface Review {
  id: string
  pr_id: number
  pr_title: string
  pr_url: string
  pr_opened: boolean
  repo_id: number
  status: ReviewStatus | null
  created_at: Date 
  repository?: {
    name: string
    full_name: string
  }
}

const statusVariants: Record<ReviewStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  running: "outline",
  completed: "default",
  failed: "destructive"
}

const statusLabels: Record<ReviewStatus, string> = {
  pending: "Pending",
  running: "Running",
  completed: "Completed",
  failed: "Failed"
}

interface RecentReviewsProps {
  reviews: Review[] 
  isLoading?: boolean
}

function ReviewCardSkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 border-b last:border-0">
      <Skeleton className="h-10 w-10 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  )
}

export function RecentReviews({ reviews, isLoading }: RecentReviewsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <ReviewCardSkeleton key={i} />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <GitPullRequest className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-sm text-muted-foreground">No reviews yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Reviews will appear here when PRs are opened
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - new Date(date).getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays}d ago`
    return new Date(date).toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Reviews</CardTitle>
        <Link href="/dashboard/repositories">
          <Button variant="ghost" size="sm" className="text-xs">
            View all
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {reviews.map((review) => (
            <Link
              key={review.id}
              href={review.pr_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-start gap-4 p-3 hover:bg-muted/50 transition-colors rounded-md group">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <GitPullRequest className={cn(
                    "h-5 w-5",
                    review.status === "completed" && "text-green-500",
                    review.status === "failed" && "text-red-500",
                    review.status === "running" && "text-blue-500",
                    (!review.status || review.status === "pending") && "text-muted-foreground"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {review.pr_title}
                    </p>
                    <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {review.repository?.name || `Repository #${review.repo_id}`}
                    </p>
                    <span className="text-muted-foreground/50">•</span>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(review.created_at )}
                    </p>
                  </div>
                </div>
                <Badge variant={statusVariants[review.status || "pending"]} className="flex-shrink-0">
                  {statusLabels[review.status || "pending"]}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
