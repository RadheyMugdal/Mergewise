ALTER TABLE "installations" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "current_period_start" timestamp;--> statement-breakpoint
ALTER TABLE "installations" ADD CONSTRAINT "installations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;