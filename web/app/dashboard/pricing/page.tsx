import PricingView from "@/modules/pricing/components/PricingView";
import { HydrateClient, trpc } from "@/trpc/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Explore our flexible pricing plans for AI-powered code reviews. Choose the perfect plan for your team's needs with transparent pricing.",
  keywords: ["pricing", "subscription", "plans", "AI code review pricing", "GitHub review pricing"],
  robots: {
    index: false,
    follow: true,
  },
};


export default async function PricingPage() {
   await trpc.pricing.getSubscription.prefetch()
   await trpc.pricing.getUserUsage.prefetch()
  return (
    <HydrateClient>
     <PricingView/>
    </HydrateClient>
  );
}
