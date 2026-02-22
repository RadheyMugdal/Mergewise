import {
  Navigation,
  Hero,
  TrustedBy,
  Features,
  HowItWorks,
  DashboardPreview,
  Pricing,
  CTA,
  Footer,
  ScrollProgress,
} from "@/components/landing";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async  function LandingPage() {
  const session=await auth.api.getSession({
    headers:await headers()
  })
  if(session?.session){
    redirect("/dashboard")
  }
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Navigation />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <HowItWorks />
        <DashboardPreview />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
