import { db } from "@/db";
import { account, installations, repositories, reviews } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq, and, count, desc, inArray } from "drizzle-orm";

export const dashboardRouter = createTRPCRouter({
    getRepositories: protectedProcedure.query(async ({ ctx }) => {
        const [accountData] = await db.select({
            account_id: account.accountId
        }).from(account).where(eq(account.userId, ctx.user.id)).limit(1)

        const data = await db.select({
            id: repositories.id,
            name: repositories.name,
            private: repositories.private,
            installation_id:repositories.installation_id
        }).from(repositories).innerJoin(
            installations,
            eq(repositories.installation_id, installations.id)
        ).where(eq(installations.account_id, parseInt(accountData.account_id)))
        return data
    }),

    getStats: protectedProcedure.query(async ({ ctx }) => {
        const [accountData] = await db.select({
            account_id: account.accountId
        }).from(account).where(eq(account.userId, ctx.user.id)).limit(1)

        // Get total repositories
        const [repoCount] = await db.select({
            count: count()
        }).from(repositories).innerJoin(
            installations,
            eq(repositories.installation_id, installations.id)
        ).where(eq(installations.account_id, parseInt(accountData.account_id)))

        // Get reviews by status
        const userRepoIds = await db.select({
            id: repositories.id
        }).from(repositories).innerJoin(
            installations,
            eq(repositories.installation_id, installations.id)
        ).where(eq(installations.account_id, parseInt(accountData.account_id)))

        const repoIds = userRepoIds.map(r => r.id)

        if (repoIds.length === 0) {
            return {
                totalRepositories: 0,
                totalReviews: 0,
                pendingReviews: 0,
                completedReviews: 0,
                runningReviews: 0,
                failedReviews: 0
            }
        }

        const statusCounts = await db.select({
            status: reviews.status,
            count: count()
        }).from(reviews).where(inArray(reviews.repo_id, repoIds))
            .groupBy(reviews.status)

        const totalReviewsResult = await db.select({
            count: count()
        }).from(reviews).where(inArray(reviews.repo_id, repoIds))

        return {
            totalRepositories: repoCount.count,
            totalReviews: totalReviewsResult[0]?.count || 0,
            pendingReviews: statusCounts.find(s => s.status === 'pending')?.count || 0,
            completedReviews: statusCounts.find(s => s.status === 'completed')?.count || 0,
            runningReviews: statusCounts.find(s => s.status === 'running')?.count || 0,
            failedReviews: statusCounts.find(s => s.status === 'failed')?.count || 0
        }
    }),

    getRecentReviews: protectedProcedure.query(async ({ ctx }) => {
        const [accountData] = await db.select({
            account_id: account.accountId
        }).from(account).where(eq(account.userId, ctx.user.id)).limit(1)

        const userRepoIds = await db.select({
            id: repositories.id,
            name: repositories.name,
            full_name: repositories.full_name
        }).from(repositories).innerJoin(
            installations,
            eq(repositories.installation_id, installations.id)
        ).where(eq(installations.account_id, parseInt(accountData.account_id)))

        const repoIds = userRepoIds.map(r => r.id)
        const repoMap = new Map(userRepoIds.map(r => [r.id, { name: r.name, full_name: r.full_name }]))

        if (repoIds.length === 0) {
            return []
        }

        const recentReviews = await db.select({
            id: reviews.id,
            pr_id: reviews.pr_id,
            pr_title: reviews.pr_title,
            pr_url: reviews.pr_url,
            pr_opened: reviews.pr_opened,
            repo_id: reviews.repo_id,
            status: reviews.status,
            created_at: reviews.created_at
        }).from(reviews).where(inArray(reviews.repo_id, repoIds))
            .orderBy(desc(reviews.created_at))
            .limit(5)

        return recentReviews.map(review => ({
            ...review,
            repository: repoMap.get(review.repo_id)
        }))
    })
})