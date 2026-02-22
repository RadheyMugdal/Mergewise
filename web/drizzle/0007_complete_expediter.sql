ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."subscription_status_enum";--> statement-breakpoint
CREATE TYPE "public"."subscription_status_enum" AS ENUM('active', 'on_hold', 'cancelled', 'expired', 'pending', 'paused', 'failed');--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DATA TYPE "public"."subscription_status_enum" USING "status"::"public"."subscription_status_enum";