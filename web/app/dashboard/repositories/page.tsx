"use client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { CornerLoader } from "@/components/ui/corner-loader"
import { Separator } from "@/components/ui/separator"
import {
  SidebarTrigger
} from "@/components/ui/sidebar"
import { columns } from "@/modules/dashboard/components/column"
import { DataTable } from "@/modules/dashboard/components/data-table"
import { trpc } from "@/trpc/react"
import { Plus } from "lucide-react"
import { redirect } from "next/navigation"
import { useState } from "react"

export default function RepositoriesPage() {
  const { data, isLoading } = trpc.dashboard.getRepositories.useQuery()
  const [searchValue, setSearchValue] = useState("")

  if (isLoading) {
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
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Repositories</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex items-center justify-center flex-1">
            <CornerLoader />
          </div>
      </>

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
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Repositories</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div>
            <h1 className="text-xl font-bold">Repositories</h1>
            <p className="text-sm tracking-tighter text-muted-foreground">
              List of all repositories connected to Mergewise
            </p>
          </div>
          <div className="flex justify-between gap-4">
            <div className="max-w-md w-full">
              <Input
                placeholder="Search your repository..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                redirect(`${process.env.NEXT_PUBLIC_GITHUB_INSTALLATION_URL}/new`)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Repository
            </Button>
          </div>
          <div className="flex-1 flex">
            {!data || data.length === 0 ? (
              <Empty className="max-w-lg">
                <EmptyHeader>
                  <EmptyTitle>No Repositories Connected</EmptyTitle>
                  <EmptyDescription>
                    You haven&apos;t connected any repositories yet. Get started by adding a new repository to enable AI-powered code reviews.
                  </EmptyDescription>
                  <EmptyContent>
                    <Button
                      onClick={() => {
                        redirect(`${process.env.NEXT_PUBLIC_GITHUB_INSTALLATION_URL}/new`)
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Repository
                    </Button>
                  </EmptyContent>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="flex-1">
                <DataTable columns={columns} data={data} searchValue={searchValue} />
              </div>
            )}
          </div>
        </div>
    </>
   
      
  )
}
