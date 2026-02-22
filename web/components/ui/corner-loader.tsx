import { cn } from "@/lib/utils"

export function CornerLoader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("corner-loader", className)} role="status" aria-label="Loading" {...props} />
}
