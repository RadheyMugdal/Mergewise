import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-28 pb-16">
      <div className="max-w-6xl mx-auto text-center w-full">
        {/* Badge - Increased margin to prevent touching navbar */}
        <Badge variant="outline" className="mb-6 p-2">
          <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
          AI-Powered Code Review Platform
        </Badge>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Code Review,
          <br />
          <span className="text-primary">Reimagined.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Automatically analyze pull requests, detect issues, and manage everything
          through a unified dashboard. The future of code review is here.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/signin">
            <Button size="lg" className="group">
              Start Free Trial
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button size="lg" variant="outline">
              See How It Works
            </Button>
          </Link>
        </div>

        {/* Code Preview Card */}
        <Card className="max-w-4xl mx-auto border-2 shadow-2xl">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-destructive rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-primary rounded-full" />
              </div>
              <span className="text-xs text-muted-foreground ml-2 font-mono">
                PR #142: Add authentication module
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {/* File Panel */}
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground font-mono">
                  src/auth/login.tsx
                </div>
                <div className="space-y-1 font-mono text-sm bg-muted/30 p-4 rounded-lg">
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-6 select-none">12</span>
                    <span className="text-foreground">export function Login() {"{"}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-6 select-none">13</span>
                    <span className="text-primary">const</span>
                    <span className="text-foreground">[user, setUser]</span>
                    <span className="text-muted-foreground">= useState();</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-6 select-none">14</span>
                    <span className="text-destructive">const handleSubmit = (e) =&gt; {"{"}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-6 select-none">15</span>
                    <div className="flex-1 bg-destructive/10 border border-destructive/50 px-2 py-1 rounded">
                      <span className="text-foreground">e.preventDefault();</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Panel */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  AI Analysis Complete
                </div>
                <div className="space-y-2">
                  <Card className="bg-destructive/10 border-destructive/20">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="destructive" className="text-xs">
                          Security
                        </Badge>
                        <span className="text-xs text-muted-foreground">Critical</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Missing input sanitization could lead to XSS vulnerability.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-yellow-500/10 border-yellow-500/20">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="secondary"
                          className="text-xs bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                        >
                          Performance
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Suggestion
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Consider memoizing the user state to prevent unnecessary
                        re-renders.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
