import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    step: "01",
    title: "Connect Repository",
    description: "Link your GitHub account in seconds. We support all major providers."
  },
  {
    step: "02",
    title: "Configure Rules",
    description: "Choose from 100+ pre-built rules or create custom ones for your team."
  },
  {
    step: "03",
    title: "Automate Reviews",
    description: "Our AI reviews every PR automatically with instant feedback."
  },
  {
    step: "04",
    title: "Ship Confidently",
    description: "Merge faster knowing your code has been thoroughly reviewed."
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-6">How It Works</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Set up in minutes,
            <br />
            <span className="text-primary">scale forever</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((item, index) => (
            <div key={index} className="relative">
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="text-5xl font-bold text-primary/20 mb-4">
                    {item.step}
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription className="text-base">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
