import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Spinner component
export const Spinner = ({
  className,
  size = "default",
}: {
  className?: string;
  size?: "sm" | "default" | "lg" | "xl";
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <Loader2
      className={cn(
        "animate-spin text-cyan-600 dark:text-cyan-400",
        sizeClasses[size],
        className
      )}
    />
  );
};

// Loading overlay component
export const LoadingOverlay = ({
  children,
  isLoading,
  className,
}: {
  children: React.ReactNode;
  isLoading: boolean;
  className?: string;
}) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className={cn("relative", className)}>
      <div className="opacity-50 pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <Spinner size="lg" />
      </div>
    </div>
  );
};

// Job card skeleton
export const JobCardSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-sm p-6 space-y-4">
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center space-x-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-6 w-16 rounded" />
    </div>

    <div className="space-y-2">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-10/12" />
    </div>

    <div className="flex justify-end space-x-2 pt-4">
      <Skeleton className="h-9 w-24" />
      <Skeleton className="h-9 w-24" />
    </div>
  </div>
);

// Job list skeleton
export const JobListSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <JobCardSkeleton key={index} />
    ))}
  </div>
);

// Job detail skeleton
export const JobDetailSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Skeleton className="h-6 w-20 rounded" />
        <Skeleton className="h-6 w-24 rounded" />
        <Skeleton className="h-6 w-16 rounded" />
      </div>
    </div>

    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-10/12" />
      <Skeleton className="h-4 w-9/12" />
    </div>

    <div className="space-y-4">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-10/12" />
    </div>

    <div className="flex justify-center pt-6">
      <Skeleton className="h-12 w-48" />
    </div>
  </div>
);

// Page loading skeleton
export const PageLoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-all duration-500">
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="space-y-8">
        {/* Header skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Search skeleton */}
        <Skeleton className="h-12 w-full max-w-3xl" />

        {/* Content skeleton */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4 space-y-4">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
            <JobListSkeleton count={6} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Centered loading spinner
export const CenteredSpinner = ({
  size = "lg",
  text = "Loading...",
}: {
  size?: "sm" | "default" | "lg" | "xl";
  text?: string;
}) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <Spinner size={size} />
    {text && (
      <p className="text-gray-600 dark:text-slate-400 text-sm font-medium">
        {text}
      </p>
    )}
  </div>
);

// Button loading state
export const LoadingButton = ({
  children,
  isLoading,
  loadingText = "Loading...",
  ...props
}: React.ComponentProps<"button"> & {
  isLoading: boolean;
  loadingText?: string;
}) => (
  <button
    {...props}
    disabled={isLoading || props.disabled}
    className={cn(
      "inline-flex items-center justify-center gap-2",
      props.className
    )}
  >
    {isLoading && <Spinner size="sm" />}
    {isLoading ? loadingText : children}
  </button>
);

// Table loading skeleton
export const TableSkeleton = ({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) => (
  <div className="space-y-3">
    {/* Header */}
    <div className="flex space-x-4">
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} className="h-4 w-24" />
      ))}
    </div>

    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-4 w-24" />
        ))}
      </div>
    ))}
  </div>
);

// Profile skeleton
export const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-4">
      <Skeleton className="w-20 h-20 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
      </div>
    </div>
  </div>
);
