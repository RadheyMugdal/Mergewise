import { db } from "@/db"
import { reviews, subscriptions } from "@/db/schema"
import { eq, and, gte, lt, sql } from "drizzle-orm"

// Plan limits configuration
export const PLAN_LIMITS = {
  free: { reviewsPerPeriod: 20 },
  pro: { reviewsPerPeriod: 300 },
  enterprise: { reviewsPerPeriod: Infinity }
} as const

export type Plan = keyof typeof PLAN_LIMITS

/**
 * Get the billing period start and end dates for a user
 * - For paid plans: uses subscription's current_period_start and current_period_end
 * - For free plans: uses calendar month (1st to last day of current month)
 */
export async function getBillingPeriod(userId: string) {
  const [subscription] = await db
    .select({
      plan: subscriptions.plan,
      current_period_start: subscriptions.current_period_start,
      current_period_end: subscriptions.current_period_end,
      status: subscriptions.status
    })
    .from(subscriptions)
    .where(eq(subscriptions.user_id, userId))
    .limit(1)

  // Free plan - use calendar month
  if (!subscription || subscription.plan === 'free' || subscription.status !== 'active') {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    return {
      plan: 'free' as const,
      periodStart: startOfMonth,
      periodEnd: endOfMonth
    }
  }

  // Paid plan - use subscription billing period
  return {
    plan: subscription.plan as Plan,
    periodStart: subscription.current_period_start || new Date(),
    periodEnd: subscription.current_period_end || new Date()
  }
}

/**
 * Count reviews used by a user in their current billing period
 */
export async function getUserReviewCount(userId: string): Promise<number> {
  const { periodStart, periodEnd } = await getBillingPeriod(userId)

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(reviews)
    .where(
      and(
        eq(reviews.user_id, userId),
        gte(reviews.created_at, periodStart),
        lt(reviews.created_at, periodEnd)
      )
    )

  return result[0]?.count || 0
}

/**
 * Get the limit for a user's plan
 */
export function getPlanLimit(plan: Plan): number {
  return PLAN_LIMITS[plan].reviewsPerPeriod
}

/**
 * Check if a user has exceeded their review limit
 */
export async function hasUserExceededLimit(userId: string): Promise<boolean> {
  const count = await getUserReviewCount(userId)
  const { plan } = await getBillingPeriod(userId)
  const limit = getPlanLimit(plan)

  return count >= limit
}

/**
 * Check if a user can perform a review (not exceeded limit)
 */
export async function canUserReview(userId: string): Promise<boolean> {
  return !(await hasUserExceededLimit(userId))
}

/**
 * Get user's usage stats (used, remaining, limit, period dates)
 */
export async function getUserUsage(userId: string) {
  const { plan, periodStart, periodEnd } = await getBillingPeriod(userId)
  const used = await getUserReviewCount(userId)
  const limit = getPlanLimit(plan)

  return {
    plan,
    used,
    remaining: Math.max(0, limit - used),
    limit: limit === Infinity ? null : limit,
    periodStart,
    periodEnd,
    resetsOn: periodEnd
  }
}
