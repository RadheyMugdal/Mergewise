import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq } from "drizzle-orm";
import { getUserUsage } from "@/lib/usage-tracking";

export const pricingRouter=createTRPCRouter({
    getSubscription:protectedProcedure.query(async ({ctx})=>{
        const [subscription]= await db.select({
            plan:subscriptions.plan,
            status:subscriptions.status,
            current_period_end:subscriptions.current_period_end
        }).from(subscriptions).where(eq(subscriptions.user_id,ctx.user.id)).limit(1)

        if(subscription){
            return subscription
        }
        return {
            plan:'free',
            status:'pending',
            current_period_end:null
        }
    }),

    getUserUsage:protectedProcedure.query(async ({ctx})=>{
        return await getUserUsage(ctx.user.id)
    })
})