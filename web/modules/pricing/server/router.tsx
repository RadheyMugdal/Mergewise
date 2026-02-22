import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq } from "drizzle-orm";

export const pricingRouter=createTRPCRouter({
    getSubscription:protectedProcedure.query(async ({ctx})=>{
        const [subscription]= await db.select({
            plan:subscriptions.plan,
            status:subscriptions.status,
            next_billing_date:subscriptions.next_billing_date
        }).from(subscriptions).where(eq(subscriptions.user_id,ctx.user.id)).limit(1)

        if(subscription){
            return subscription
        }
        return {
            plan:'free',
            status:'pending',
            next_billing_date:null
        }
    })
})