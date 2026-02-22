import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, BarChart3, GitPullRequest, Users, Settings } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Analysis",
    description: "AI reviews your PR in seconds, not hours. Get immediate feedback on code quality, security, and performance."
  },
  {
    icon: Shield,
    title: "Security First",
    description: "Automatically detect vulnerabilities, secrets, and security anti-patterns before they reach production."
  },
  {
    icon: BarChart3,
    title: "Unified Dashboard",
    description: "Track all your repositories, PRs, and team performance in one beautiful, intuitive interface."
  },
  {
    icon: GitPullRequest,
    title: "CI/CD Integration",
    description: "Seamlessly connect with GitHub Actions, GitLab CI, and Jenkins. Automate reviews in your pipeline."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Assign reviewers, track discussions, and maintain code quality standards across your organization."
  },
  {
    icon: Settings,
    title: "Custom Rules",
    description: "Configure 100+ pre-built rules or create custom ones. Set severity levels and team preferences."
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-6">Features</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything you need to
            <br />
            <span className="text-primary">ship faster</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful automation that catches issues before they reach production.
            Your team deserves better than manual reviews.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-4 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
