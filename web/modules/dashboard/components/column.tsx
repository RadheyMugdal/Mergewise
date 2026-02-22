"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { GitPullRequest, MessageSquare, MoreHorizontal, Settings, Settings2, Trash2 } from "lucide-react"
import { redirect, useRouter } from "next/navigation"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Repository = {
  id: number
  name:string
  private:boolean,
  installtion_id:number
}

export const columns: ColumnDef<Repository>[] = [
  {
    accessorKey: "name",
    header: "Repository name",
  },
  {
    accessorKey: "private",
    header: "Visiblity",
    cell:({row})=>{
      const repository=row.original
      
      return(
        <>
        {
          repository.private ? <Badge className=" bg-pink-500">Private</Badge> : <Badge >Public</Badge>
        }
        </>
      )
    }
  },
  {
    id:'setting',
    cell:({row})=>{
      const repository=row.original
      const router=useRouter()
      return (
        <div className=" justify-end flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              
              <Settings/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className=" w-full">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e)=>{
              e.stopPropagation()
              e.preventDefault()
              redirect(`https://github.com/apps/RadheyMugdal-quickstart-app/installations/${row.original.installtion_id}`)
            }}>
              <Trash2 />
              Remove Repository</DropdownMenuItem>
            <DropdownMenuItem onClick={((e)=>{
                e.stopPropagation()
                e.preventDefault()
                router.push(`/dashboard/repositories/${repository.id}`)
            })}>
              <GitPullRequest/>
              View All Reviews </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        </div>
      )
    }
  }
]