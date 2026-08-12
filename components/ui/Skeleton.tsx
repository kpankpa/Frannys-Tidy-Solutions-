import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-[8px] bg-primary/10", className)}
      aria-hidden
    />
  );
}

export function SkeletonLine({ className }: { className?: string }) {
  return <Skeleton className={cn("h-4 w-full", className)} />;
}

export function SkeletonTitle({ className }: { className?: string }) {
  return <Skeleton className={cn("h-9 w-2/3 max-w-md", className)} />;
}

export function SkeletonSubtitle({ className }: { className?: string }) {
  return <Skeleton className={cn("h-4 w-full max-w-lg", className)} />;
}
