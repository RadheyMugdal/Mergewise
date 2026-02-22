import { betterAuth, check } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import {
  dodopayments,
  checkout,
  portal,
  webhooks,
  usage,
} from "@dodopayments/better-auth";
import { account, session, subscriptions, user, verification } from "@/db/schema";
import DodoPayments from "dodopayments";
import { eq } from "drizzle-orm";

export const dodoPayments = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: "test_mode", // or "live_mode" for production
});
export const auth = betterAuth({
  plugins: [
    dodopayments({
      client: dodoPayments,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "pdt_0NZ2Mqhd0buiqMmvrlKxx",
              slug: "pro_plan",
            },

          ],
          successUrl: "/dashboard/success",
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({
          webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_SECRET!,
          onPayload: async (payload) => {
            switch (payload.type) {

              case "subscription.active":
              case "subscription.updated":
                // Calculate current_period_start from next_billing_date (subtract 1 month for monthly plans)
                const nextBillingDate = payload.data.next_billing_date ? new Date(payload.data.next_billing_date) : null;
                const currentPeriodStart = nextBillingDate ? new Date(nextBillingDate.getTime() - 30 * 24 * 60 * 60 * 1000) : null;

                await db.insert(subscriptions)
                  .values({
                    subscription_id: payload.data.subscription_id,
                    user_id: payload.data.metadata?.userId,
                    product_id: payload.data.product_id,
                    plan: "pro",
                    status: payload.data.status,
                    cancel_at_next_billing_date: payload.data.cancel_at_next_billing_date,
                    current_period_start: currentPeriodStart,
                    current_period_end: nextBillingDate,
                    cancelled_at: payload.data.cancelled_at
                  })
                  .onConflictDoUpdate({
                    target: subscriptions.subscription_id,
                    set: {
                      status: payload.data.status,
                      cancel_at_next_billing_date: payload.data.cancel_at_next_billing_date,
                      current_period_start: currentPeriodStart,
                      current_period_end: nextBillingDate,
                      cancelled_at: payload.data.cancelled_at
                    }
                  })

                break


              case "subscription.expired":
                await db
                  .update(subscriptions)
                  .set({
                    status: "expired",
                    plan: "free"
                  })
                  .where(eq(subscriptions.subscription_id, payload.data.subscription_id))

                break
            }
          },
        }),
        usage(),
      ]
    })
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    }
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

});