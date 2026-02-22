"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ColumnDef } from "@tanstack/react-table"
import { Eye } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// This type is used to define the shape of our data.
export type Review = {
  id: string
  pr_id: number
  pr_title: string
  pr_url: string
  pr_opened: boolean
  repo_id: number
  status: string | null
  review: string | null
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case "completed":
      return "default"
    case "pending":
      return "secondary"
    case "running":
      return "outline"
    case "failed":
      return "destructive"
    default:
      return "secondary"
  }
}

const ReviewModal = ({ review, prTitle }: { review: string | null; prTitle: string }) => {
  if (!review) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" disabled>
            <Eye className="mr-2 h-4 w-4" />
            No Review
          </Button>
        </DialogTrigger>
      </Dialog>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          Show Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review for: {prTitle}</DialogTitle>
        </DialogHeader>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {review}
          </ReactMarkdown>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const columns: ColumnDef<Review>[] = [
  {
    accessorKey: "pr_title",
    header: "PR Title",
    cell: ({ row }) => {
      const review = row.original
      return (
        <div className="max-w-md truncate" title={review.pr_title}>
          {review.pr_title}
        </div>
      )
    }
  },
  {
    accessorKey: "pr_id",
    header: "PR #",
    cell: ({ row }) => {
      const review = row.original
      return (
        <Link href={review.pr_url} target="_blank" className="text-blue-500 hover:underline">
          #{review.pr_id}
        </Link>
      )
    }
  },
  {
    accessorKey: "pr_opened",
    header: "Status",
    cell: ({ row }) => {
      const review = row.original
      return (
        <>
          {review.pr_opened ? <Badge>Open</Badge> : <Badge variant="secondary">Closed</Badge>}
        </>
      )
    }
  },
  {
    accessorKey: "review_status",
    header: "Review Status",
    cell: ({ row }) => {
      const review = row.original
      return (
        <Badge variant={getStatusVariant(review.status || "pending")}>
          {review.status || "Pending"}
        </Badge>
      )
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const review = row.original
      return <ReviewModal review={review.review} prTitle={review.pr_title} />
    }
  }
]
