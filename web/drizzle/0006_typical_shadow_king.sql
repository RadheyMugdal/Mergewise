ALTER TYPE "public"."subscription_status_enum" ADD VALUE 'failed';--> statement-breakpoint
ALTER TYPE "public"."subscription_status_enum" ADD VALUE 'paused';--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "plan" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."plan_enum";--> statement-breakpoint
CREATE TYPE "public"."plan_enum" AS ENUM('free', 'pro', 'enterprise');--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "plan" SET DATA TYPE "public"."plan_enum" USING "plan"::"public"."plan_enum";--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "current_period_end" DROP NOT NULL;