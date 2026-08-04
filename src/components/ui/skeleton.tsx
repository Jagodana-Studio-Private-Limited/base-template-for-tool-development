import { cn } from "@/lib/utils"

interface SkeletonProps extends React.ComponentProps<"div"> {
  shimmer?: boolean;
}

function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-md bg-accent",
        className
      )}
      {...props}
    >
      {shimmer && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-background/20 to-transparent" />
      )}
    </div>
  )
}

export { Skeleton }
