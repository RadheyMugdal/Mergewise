"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { trpc } from "@/trpc/react"
import { Calendar, RefreshCw, Zap, Shield, Building2 } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"

const PLAN_INFO = {
  free: {
    name: "Free Plan",
    icon: <Zap className="w-4 h-4" />,
    color: "bg-muted-foreground"
  },
  pro: {
    name: "Pro Plan",
    icon: <Shield className="w-4 h-4" />,
    color: "bg-primary"
  },
  enterprise: {
    name: "Enterprise",
    icon: <Building2 className="w-4 h-4" />,
    color: "bg-secondary"
  }
} as const

export function UsageCard() {
  const { data: usage, isLoading } = trpc.pricing.getUserUsage.useQuery()

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-2 bg-muted rounded w-full" />
        </div>
      </Card>
    )
  }

  if (!usage) return null

  const planInfo = PLAN_INFO[usage.plan]
  const percentage = usage.limit ? Math.min((usage.used / usage.limit) * 100, 100) : 0
  const isUnlimited = usage.limit === null
  const isNearLimit = !isUnlimited && usage.remaining <= 5
  const isOverLimit = !isUnlimited && usage.limit !== null && usage.used > usage.limit

  // Format reset date
  const resetDate = usage.resetsOn
  const resetText = resetDate
    ? `Resets ${formatDistanceToNow(resetDate, { addSuffix: true })}`
    : "Unknown"

  return (
    <Card className={isNearLimit || isOverLimit ? "border-orange-500/50 dark:border-orange-500/50" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {planInfo.icon}
            {planInfo.name}
          </CardTitle>
          {isUnlimited ? (
            <Badge variant="secondary" className="text-xs">Unlimited</Badge>
          ) : isOverLimit ? (
            <Badge variant="destructive" className="text-xs">Limit Reached</Badge>
          ) : isNearLimit ? (
            <Badge variant="outline" className="text-xs border-orange-500 text-orange-500">
              {usage.remaining} left
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              {usage.remaining} remaining
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Progress Bar */}
        {!isUnlimited && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{usage.used} reviews</span>
              <span>{usage.limit} / {format(usage.periodStart, "MMM")} - {format(usage.periodEnd, "MMM")}</span>
            </div>
            <Progress
              value={percentage}
              className="h-2"
              indicatorClassName={
                isOverLimit
                  ? "bg-destructive"
                  : isNearLimit
                    ? "bg-orange-500"
                    : ""
              }
            />
          </div>
        )}

        {isUnlimited && (
          <div className="text-center py-2">
            <p className="text-sm font-medium">Unlimited Reviews</p>
            <p className="text-xs text-muted-foreground">Your current billing period</p>
          </div>
        )}

        {/* Reset Info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className="w-3 h-3" />
          <span>{resetText}</span>
        </div>

        {/* Upgrade CTA for free users near limit */}
        {usage.plan === 'free' && isNearLimit && (
          <a
            href="/dashboard/pricing"
            className="block text-xs text-center text-primary hover:underline mt-2"
          >
            Upgrade to Pro for 300 reviews/month →
          </a>
        )}
      </CardContent>
    </Card>
  )
}
