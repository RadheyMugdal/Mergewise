"use client"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { CornerLoader } from '@/components/ui/corner-loader'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { trpc } from '@/trpc/react'
import { Separator } from '@/components/ui/separator'
import React, { useState } from 'react'
import { DataTable } from './data-table'
import { columns } from './column'

const RepositoryView = ({ id }: { id: string }) => {
    const [searchValue, setSearchValue] = useState("")
    const { data: repository, isLoading, isError } = trpc.repository.get.useQuery({ id })
    const { data: reviews, isLoading: reviewsLoading } = trpc.repository.getReviews.useQuery({ id })

    if (isLoading || reviewsLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <CornerLoader />
            </div>
        )
    }

    if (!repository || isError) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <p>Something went wrong :(</p>
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
                                <BreadcrumbLink href="/dashboard">
                                    Dashboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href={`/dashboard/repositories/${id}`}>
                                    {repository?.name}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>

                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div>
                    <h1 className="text-xl font-bold">{repository?.name}</h1>
                    <p className=" text-sm tracking-tighter">Explore all reviews of {repository?.name}</p>
                </div>
                <div className="flex justify-between gap-4">
                    <div className="max-w-md w-full">
                        <Input
                            placeholder="Search by PR title or number..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 flex">
                    {!reviews || reviews.length === 0 ? (
                        <Empty>
                            <EmptyHeader>
                                <EmptyTitle>
                                    No Reviews yet
                                </EmptyTitle>
                                <EmptyDescription>
                                    There are no reviews yet for this repository.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : (
                        <div className="flex-1">
                            <DataTable columns={columns} data={reviews} searchValue={searchValue} />
                        </div>
                    )}
                </div>
            </div>

        </>
    )
}

export default RepositoryView
