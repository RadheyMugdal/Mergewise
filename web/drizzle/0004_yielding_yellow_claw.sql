CREATE TYPE "public"."plan_enum" AS ENUM('free_plan', 'pro_plan', 'enterprise_plan');--> statement-breakpoint
CREATE TYPE "public"."subscription_status_enum" AS ENUM('active', 'on_hold', 'cancelled', 'expired', 'pending');--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"customer_id" text NOT NULL,
	"subscription_id" text NOT NULL,
	"product_id" text NOT NULL,
	"plan" "plan_enum" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" "subscription_status_enum" NOT NULL,
	"cancelled_at" timestamp,
	"current_period_end" timestamp NOT NULL,
	"cancel_at_next_billing_date" boolean NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "review" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;