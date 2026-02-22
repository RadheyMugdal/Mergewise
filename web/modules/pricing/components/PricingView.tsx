"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Check, CreditCard, Zap, Shield, Headphones, Building2 } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/trpc/react";
import { UsageCard } from "./usage-card";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    slug: "free_plan",
    description: "Perfect for individuals and small projects",
    icon: <Zap className="w-5 h-5" />,
    color: "bg-muted",
    features: [
      { name: "20 reviews/month", included: true },
      { name: "Unlimited repositories", included: true },
      { name: "Basic AI analysis", included: true },
      { name: "Code quality suggestions", included: true },
      { name: "Community support", included: true },
      { name: "Advanced security scanning", included: false },
      { name: "Custom rules", included: false },
      { name: "Team collaboration", included: false },
    ],
    cta: "Current Plan",
    current: true,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    slug: "pro_plan",
    description: "For growing teams and power users",
    icon: <Shield className="w-5 h-5" />,
    color: "bg-primary/10",
    features: [
      { name: "300 reviews/month", included: true },
      { name: "Unlimited repositories", included: true },
      { name: "Advanced AI analysis", included: true },
      { name: "Security vulnerability scanning", included: true },
      { name: "Custom review rules", included: true },
      { name: "Priority email support", included: true },
      { name: "Team collaboration (5 users)", included: true },
      { name: "API access", included: true },
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    slug: "enterprise_plan",
    period: "",
    description: "For large organizations with advanced needs",
    icon: <Building2 className="w-5 h-5" />,
    color: "bg-secondary/10",
    features: [
      { name: "Everything in Pro", included: true },
      { name: "Unlimited team members", included: true },
      { name: "SSO/SAML authentication", included: true },
      { name: "Self-hosted deployment", included: true },
      { name: "Custom integrations", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "24/7 phone support", included: true },
      { name: "SLA guarantee", included: true },
      { name: "On-premise option", included: true },
    ],
    cta: "Contact Sales",
    enterprise: true,
  },
];
const PricingView = () => {
    const { data: subscription } = trpc.pricing.getSubscription.useQuery()

    // Determine the current plan slug from subscription
    const currentPlanSlug = subscription?.plan?.toLowerCase() === 'pro' ? 'pro_plan' : 'free_plan'
    const isProPlan = currentPlanSlug === 'pro_plan'

    const handleManageSubscription = async () => {
      // @ts-ignore - Dodo Payments Better Auth client types may not be properly inferred
      const { data: portalSession } = await authClient.dodopayments.dodoPortal()
      if (portalSession?.url) {
        window.location.href = portalSession.url
      }
    }

    // Update plans with current subscription status
    const updatedPlans = plans.map(plan => ({
      ...plan,
      current: plan.slug === currentPlanSlug
    }))

  return (
    <>
       <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Pricing</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        {/* Header */}
        <div className="text-center space-y-3 py-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Choose the right plan for your team
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Scale your code review workflow with AI-powered automation. Start free
            and upgrade as you grow.
          </p>
        </div>

        {/* Current Usage Card */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <UsageCard />
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {updatedPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.popular
                  ? "border-2 border-primary shadow-xl shadow-primary/10"
                  : "border"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm font-bold">
                    MOST POPULAR
                  </Badge>
                </div>
              )}
              <CardHeader className="space-y-3 pb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${plan.color}`}>
                    {plan.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <CardDescription className="mt-2">
                    {plan.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-6">
                {/* Features List */}
                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div
                        className={`mt-0.5 shrink-0 ${
                          feature.included
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {feature.included ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-current opacity-30" />
                        )}
                      </div>
                      <span
                        className={
                          feature.included
                            ? "text-foreground"
                            : "text-muted-foreground line-through opacity-60"
                        }
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className="w-full"
                  variant={
                    plan.current
                      ? "outline"
                      : plan.popular
                        ? "default"
                        : "outline"
                  }
                  size="lg"
                  disabled={plan.current && !isProPlan}
                  onClick={async () => {
                    // If user is on pro plan and clicking pro plan card, show portal
                    if (plan.slug === 'pro_plan' && isProPlan) {
                      handleManageSubscription()
                      return
                    }

                    // Otherwise, checkout for pro plan
                    if (plan.slug === 'pro_plan') {
                      const { data: session } = await authClient.dodopayments.checkoutSession({
                        slug: plan.slug,
                        metadata: {
                          plan: 'pro'
                        },
                        return_url: `${window.location.origin}/dashboard/checkout/success`
                      });
                      if (session) {
                        window.location.href = session.url;
                      }
                    }
                  }}
                >
                  {plan.current && isProPlan ? (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Manage Subscription
                    </>
                  ) : plan.current ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      {plan.cta}
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      {plan.cta}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className=" w-full  px-12 pt-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                q: "Can I switch plans anytime?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, including Visa, Mastercard, and American Express.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes! All paid plans come with a 14-day free trial. No credit card required.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Absolutely. You can cancel your subscription at any time with no questions asked.",
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">{faq.q}</CardTitle>
                  <CardDescription className="text-sm">
                    {faq.a}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <Card className="bg-muted/30 border-primary/20">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Headphones className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">
              Need help choosing a plan?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Our team is here to help you find the perfect solution for your
              code review needs.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="default" size="lg">
                Contact Sales
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default PricingView
