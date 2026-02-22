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

export default function LandingPage() {
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
