CREATE TYPE "public"."status" AS ENUM('pending', 'running', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pr_id" bigint NOT NULL,
	"pr_title" varchar NOT NULL,
	"pr_url" text NOT NULL,
	"pr_opened" boolean NOT NULL,
	"repo_id" bigint NOT NULL,
	"status" "status",
	"review" varchar,
	"created_at" timestamp DEFAULT now()
);
