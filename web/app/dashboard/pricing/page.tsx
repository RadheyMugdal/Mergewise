import PricingView from "@/modules/pricing/components/PricingView";
import { HydrateClient, trpc } from "@/trpc/server";


export default async function PricingPage() {
   await trpc.pricing.getSubscription.prefetch()
   await trpc.pricing.getUserUsage.prefetch()
  return (
    <HydrateClient>
     <PricingView/>
    </HydrateClient>
  );
}
