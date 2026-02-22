"use client"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { CornerLoader } from "@/components/ui/corner-loader"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { RecentReviews } from "@/modules/dashboard/components/recent-reviews"
import { StatsGrid } from "@/modules/dashboard/components/stats-card"
import { trpc } from "@/trpc/react"
import { Plus } from "lucide-react"
import Link from "next/link"

const DEFAULT_STATS = {
  totalRepositories: 0,
  totalReviews: 0,
  pendingReviews: 0,
  completedReviews: 0,
  runningReviews: 0,
  failedReviews: 0
}

export default function Page() {
  const { data: stats, isLoading: statsLoading } = trpc.dashboard.getStats.useQuery()
  const { data: reviews, isLoading: reviewsLoading } = trpc.dashboard.getRecentReviews.useQuery()
  const { data: repositories, isLoading: reposLoading } = trpc.dashboard.getRepositories.useQuery()

  const hasNoData = !repositories || repositories.length === 0
  const statsData = stats ?? DEFAULT_STATS

  if (reposLoading) {
    return (
     
          <div className="flex items-center justify-center h-screen">
            <CornerLoader />
          </div>
       
    )
  }

  return (
   <>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbPage>
                    Dashboard
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {hasNoData ? "Welcome to Mergewise" : "Dashboard"}
              </h1>
              <p className="text-muted-foreground">
                {hasNoData
                  ? "Get started by connecting your GitHub repositories"
                  : "Monitor your code reviews and repository activity"}
              </p>
            </div>
            {!hasNoData && (
              <Link href="/dashboard/repositories">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Repository
                </Button>
              </Link>
            )}
          </div>

          {/* Empty State for First Time Users */}
          {hasNoData && (
            <div className="flex-1 flex items-center justify-center">
              <Empty className="max-w-lg">
                <EmptyHeader>
                  <EmptyTitle className="text-xl">
                    No Repositories Connected
                  </EmptyTitle>
                  <EmptyDescription className="text-base">
                    Connect your GitHub repositories to start using AI-powered code reviews.
                    Get automated feedback on your pull requests instantly.
                  </EmptyDescription>
                  <EmptyContent className="mt-6 gap-3">
                    <Button
                      size="lg"
                      onClick={() => {
                        window.location.href = `${process.env.NEXT_PUBLIC_GITHUB_INSTALLATION_URL}/new`
                      }}
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Connect GitHub Repository
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <Link href={`${process.env.NEXT_PUBLIC_GITHUB_INSTALLATION_URL}/new`} target="_blank">
                        Learn More
                      </Link>
                    </Button>
                  </EmptyContent>
                </EmptyHeader>
              </Empty>
            </div>
          )}

          {/* Dashboard Content */}
          {!hasNoData && (
            <>
              {/* Stats Grid */}
              <StatsGrid stats={statsData} isLoading={statsLoading} />

              {/* Recent Reviews Section */}
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <RecentReviews reviews={reviews || []} isLoading={reviewsLoading} />
                </div>

                {/* Quick Actions / Info Card */}
                <div className="space-y-4">
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="font-semibold mb-2">Quick Actions</h3>
                    <div className="space-y-2">
                      <Link href="/dashboard/repositories">
                        <Button variant="outline" className="w-full justify-start">
                          <Plus className="mr-2 h-4 w-4" />
                          Add New Repository
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          window.location.href = `${process.env.NEXT_PUBLIC_GITHUB_INSTALLATION_URL}/new`
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Install GitHub App
                      </Button>
                    </div>
                  </div>

                  {statsData?.failedReviews > 0 && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                      <p className="text-sm font-medium text-destructive">
                        {statsData.failedReviews} failed review{statsData.failedReviews > 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Some reviews failed to complete. Check your repositories for details.
                      </p>
                    </div>
                  )}

                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="font-semibold mb-2">About Mergewise</h3>
                    <p className="text-sm text-muted-foreground">
                      Get AI-powered code reviews for your pull requests automatically.
                      Connect your repositories and let Mergewise analyze your code changes.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
   </>
    
  )
}
