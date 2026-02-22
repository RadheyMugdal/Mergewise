import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal } from "lucide-react";

const stats = [
  { label: "Active Repos", value: "12", change: "+2" },
  { label: "PRs Reviewed", value: "847", change: "+23" },
  { label: "Issues Found", value: "156", change: "-12" },
  { label: "Time Saved", value: "42h", change: "+8h" }
];

const recentPRs = [
  { repo: "acme/auth", title: "Add OAuth2 support", status: "reviewing", time: "2m ago" },
  { repo: "acme/api", title: "Fix rate limiting bug", status: "approved", time: "15m ago" },
  { repo: "acme/ui", title: "Update button components", status: "changes", time: "1h ago" }
];

export function DashboardPreview() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-6">Dashboard</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your command center
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Monitor all your repositories, track team performance, and never miss a
            critical review.
          </p>
        </div>

        {/* Dashboard Mock */}
        <Card className="border-2 shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={"flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"}>
            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="currentColor" className={"icon icon-tabler icons-tabler-filled icon-tabler-binary-tree-2 size-6"}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3a3 3 0 0 1 2.616 4.47l3.274 3.742a3 3 0 1 1 -1.505 1.318l-3.275 -3.743l-.11 .042v6.342a3.001 3.001 0 1 1 -2 0v-6.342l-.111 -.041l-3.274 3.742a3 3 0 1 1 -1.505 -1.318l3.273 -3.742a3 3 0 0 1 2.617 -4.47" /></svg>
          </div>

                <span className="font-semibold text-lg">Dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                  JD
                </div>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  John D.
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-muted/30 border-none">
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                      {stat.label}
                    </div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div
                      className={`text-xs font-medium ${
                        stat.change.startsWith("+") ? "text-primary" : "text-destructive"
                      }`}
                    >
                      {stat.change} this week
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                Recent Pull Requests
              </h3>
              <div className="space-y-3">
                {recentPRs.map((pr, index) => (
                  <Card
                    key={index}
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div
                            className={`w-3 h-3 rounded-full shrink-0 ${
                              pr.status === "reviewing"
                                ? "bg-yellow-500 animate-pulse"
                                : pr.status === "approved"
                                  ? "bg-primary"
                                  : "bg-orange-500"
                            }`}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium truncate">
                              {pr.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {pr.repo}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground shrink-0">
                          {pr.time}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
